(() => {
  // trollspeed_light.js
  //
  // Port of opa334's TrollSpeed (https://github.com/Lessica/TrollSpeed) to the
  // lightsaber JS-injection chain. The original TrollSpeed is a TrollStore-
  // signed UIApplication that runs as its own process with assistivetouchd
  // entitlements and uses SBSAccessibilityWindowHostingController to host its
  // HUD on top of every other app. We don't need any of that because we
  // inject directly into SpringBoard, which already owns the screen and can
  // create a vanilla UIWindow with a high windowLevel.
  //
  // Persistence model: lives only inside SpringBoard's address space, dies on
  // respring (same as fiveicondock_light.js). To re-enable after a respring,
  // re-run the chain.
  //
  // The HUD is a single UILabel attached to SpringBoard's keyWindow with a
  // hardcoded frame and font. An NSTimer fires every 1.0s, calling
  // [jsctx evaluateScript:@"__ts_tick()"] on the main thread. __ts_tick reads
  // getifaddrs(), sums ifi_ibytes / ifi_obytes for en* and pdp_ip* interfaces,
  // computes diff from the previous reading, formats as KB/s or MB/s, and
  // updates the label text.
  //
  // The hardest part of the port is that several methods we need take double
  // (NSTimeInterval, CGFloat) or struct (CGRect) arguments. The Native bridge
  // only sets X0-X7 (general-purpose registers), but ARM64 ABI puts doubles in
  // V0-V7 (FP registers) and HFA structs like CGRect in V0-V3. We work around
  // this by building NSInvocation objects, which marshal arguments via
  // setArgument:atIndex: + memcpy and don't care about register conventions.

  const HUD_FONT_SIZE = 10.0;
  const HUD_UPDATE_INTERVAL_SEC = 1.0;
  // Hardcoded frame for now (no prefs UI in v1). Top-center of a ~390pt wide
  // iPhone screen, just below the notch / Dynamic Island.
  const HUD_FRAME = { x: 75.0, y: 58.0, w: 240.0, h: 22.0 };
  // Probe mode: keep logs sparse but deterministic so PAC crash location can be
  // inferred from the last emitted stage marker.
  const TS_PROBE_MODE = true;
  const TS_STAGE_SET_FRAME = 1;
  const TS_STAGE_STYLE = 2;
  const TS_STAGE_FONT = 4;
  const TS_STAGE_LAYER = 8;
  const TS_STAGE_ADD_SUBVIEW = 16;
  const TS_STAGE_TIMER = 32;
  const TS_STAGE_ALL = (
    TS_STAGE_SET_FRAME |
    TS_STAGE_STYLE |
    TS_STAGE_FONT |
    TS_STAGE_LAYER |
    TS_STAGE_ADD_SUBVIEW |
    TS_STAGE_TIMER
  );
  const TS_STAGE_MASK = (
    typeof globalThis.__ts_stage_mask === "number" &&
    (globalThis.__ts_stage_mask | 0) > 0
  ) ? (globalThis.__ts_stage_mask | 0) : TS_STAGE_ALL;

  const KB = 1024;
  const MB = 1024 * 1024;
  const GB = 1024 * 1024 * 1024;

  class Native {
    static #baseAddr;
    static #dlsymAddr;
    static #memcpyAddr;
    static #mallocAddr;
    static mem = 0n;
    static memSize = 0x4000;
    static #argMem = 0n;
    static #argPtr = 0n;
    static #dlsymCache = {};

    static init() {
      const buff = new BigUint64Array(nativeCallBuff);
      this.#baseAddr = buff[20];
      this.#dlsymAddr = buff[21];
      this.#memcpyAddr = buff[22];
      this.#mallocAddr = buff[23];
      this.mem = this.#nativeCallAddr(this.#mallocAddr, BigInt(this.memSize));
      this.#argMem = this.#nativeCallAddr(this.#mallocAddr, 0x1000n);
      this.#argPtr = this.#argMem;
    }

    static write(ptr, buff) {
      if (!ptr) return false;
      const buff8 = new Uint8Array(nativeCallBuff);
      let offs = 0;
      let left = buff.byteLength;
      while (left) {
        let len = left;
        if (len > 0x1000) len = 0x1000;
        buff8.set(new Uint8Array(buff, offs, len), 0x1000);
        this.#nativeCallAddr(this.#memcpyAddr, ptr + BigInt(offs), this.#baseAddr + 0x1000n, BigInt(len));
        left -= len;
        offs += len;
      }
      return true;
    }

    static read(ptr, length) {
      if (!ptr) return null;
      const buff = new ArrayBuffer(length);
      const buff8 = new Uint8Array(buff);
      let offs = 0;
      let left = length;
      while (left) {
        let len = left;
        if (len > 0x1000) len = 0x1000;
        this.#nativeCallAddr(this.#memcpyAddr, this.#baseAddr + 0x1000n, ptr + BigInt(offs), BigInt(len));
        buff8.set(new Uint8Array(nativeCallBuff, 0x1000, len), offs);
        left -= len;
        offs += len;
      }
      return buff;
    }

    static readPtr(ptr) {
      const dv = new DataView(this.read(ptr, 8));
      return dv.getBigUint64(0, true);
    }

    static writeString(ptr, str) {
      this.write(ptr, this.stringToBytes(str, true));
    }

    static readString(ptr, len = 512) {
      return this.bytesToString(this.read(ptr, len), false);
    }

    static bytesToString(bytes, includeNullChar = true) {
      const bytes8 = new Uint8Array(bytes);
      let str = "";
      for (let i = 0; i < bytes8.length; i++) {
        if (!includeNullChar && !bytes8[i]) break;
        str += String.fromCharCode(bytes8[i]);
      }
      return str;
    }

    static stringToBytes(str, nullTerminated = false) {
      const buff = new ArrayBuffer(str.length + (nullTerminated ? 1 : 0));
      const s8 = new Uint8Array(buff);
      for (let i = 0; i < str.length; i++) s8[i] = str.charCodeAt(i);
      if (nullTerminated) s8[str.length] = 0;
      return s8.buffer;
    }

    static #toNative(value) {
      if (!value) return 0n;
      if (typeof value === "string") {
        const ptr = this.#argPtr;
        this.writeString(ptr, value);
        this.#argPtr += BigInt(value.length + 1);
        return ptr;
      }
      if (typeof value === "bigint") return value;
      return BigInt(value);
    }

    static #dlsym(name) {
      if (!name) return 0n;
      let addr = this.#dlsymCache[name];
      if (addr) return addr;
      const RTLD_DEFAULT = 0xfffffffffffffffen;
      const nameBytes = this.stringToBytes(name, true);
      const buff8 = new Uint8Array(nativeCallBuff);
      buff8.set(new Uint8Array(nameBytes), 0x1000);
      addr = this.#nativeCallAddr(this.#dlsymAddr, RTLD_DEFAULT, this.#baseAddr + 0x1000n);
      if (addr) this.#dlsymCache[name] = addr;
      return addr;
    }

    static #nativeCallAddr(addr, x0 = 0n, x1 = 0n, x2 = 0n, x3 = 0n, x4 = 0n, x5 = 0n, x6 = 0n, x7 = 0n) {
      const buff = new BigInt64Array(nativeCallBuff);
      buff[0] = addr;
      buff[100] = x0;
      buff[101] = x1;
      buff[102] = x2;
      buff[103] = x3;
      buff[104] = x4;
      buff[105] = x5;
      buff[106] = x6;
      buff[107] = x7;
      invoker();
      return buff[200];
    }

    static callSymbol(name, x0, x1, x2, x3, x4, x5, x6, x7) {
      this.#argPtr = this.#argMem;
      x0 = this.#toNative(x0);
      x1 = this.#toNative(x1);
      x2 = this.#toNative(x2);
      x3 = this.#toNative(x3);
      x4 = this.#toNative(x4);
      x5 = this.#toNative(x5);
      x6 = this.#toNative(x6);
      x7 = this.#toNative(x7);
      const funcAddr = this.#dlsym(name);
      const ret64 = this.#nativeCallAddr(funcAddr, x0, x1, x2, x3, x4, x5, x6, x7);
      this.#argPtr = this.#argMem;
      if (ret64 < 0xffffffffn && ret64 > -0xffffffffn) return Number(ret64);
      return ret64;
    }

    static bridgeInfo() {
      const buff = new BigUint64Array(nativeCallBuff);
      return {
        jsctx: buff[25],
        jsContextObj: buff[33],
      };
    }
  }

  function u64(v) {
    if (!v) return 0n;
    return BigInt.asUintN(64, BigInt(v));
  }

  function isNonZero(v) {
    return u64(v) !== 0n;
  }

  function log(msg) {
    try {
      const tagged = "[TROLLSPEED] " + msg;
      const ptr = Native.callSymbol("malloc", BigInt(tagged.length + 1));
      if (!ptr) return;
      Native.writeString(ptr, tagged);
      Native.callSymbol("syslog", 5, ptr);
      Native.callSymbol("free", ptr);
    } catch (_) {}
  }

  function sel(name) {
    return Native.callSymbol("sel_registerName", name);
  }

  function objc(obj, selectorName, ...args) {
    return Native.callSymbol("objc_msgSend", obj, sel(selectorName), ...args);
  }

  function probe(msg) {
    if (TS_PROBE_MODE) log("[PROBE] " + msg);
  }

  function stageEnabled(stageBit) {
    return (TS_STAGE_MASK & stageBit) !== 0;
  }

  function canRespond(obj, selectorName) {
    if (!isNonZero(obj)) return false;
    return isNonZero(objc(obj, "respondsToSelector:", sel(selectorName)));
  }

  function requireSelector(obj, selectorName, who) {
    const ok = canRespond(obj, selectorName);
    probe((ok ? "ok " : "miss ") + who + " -> " + selectorName);
    return ok;
  }

  // Build a CFString from a JS string. Handles non-ASCII codepoints by
  // encoding to UTF-8 bytes manually (no TextEncoder dependency, no unicode
  // characters in this source file). Use this for label text that contains
  // characters like the up/down arrows.
  function cfstrUtf8(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      let cp = str.charCodeAt(i);
      if (cp >= 0xD800 && cp <= 0xDBFF && i + 1 < str.length) {
        const cp2 = str.charCodeAt(i + 1);
        if (cp2 >= 0xDC00 && cp2 <= 0xDFFF) {
          cp = 0x10000 + ((cp - 0xD800) << 10) + (cp2 - 0xDC00);
          i++;
        }
      }
      if (cp < 0x80) {
        bytes.push(cp);
      } else if (cp < 0x800) {
        bytes.push(0xC0 | (cp >> 6));
        bytes.push(0x80 | (cp & 0x3F));
      } else if (cp < 0x10000) {
        bytes.push(0xE0 | (cp >> 12));
        bytes.push(0x80 | ((cp >> 6) & 0x3F));
        bytes.push(0x80 | (cp & 0x3F));
      } else {
        bytes.push(0xF0 | (cp >> 18));
        bytes.push(0x80 | ((cp >> 12) & 0x3F));
        bytes.push(0x80 | ((cp >> 6) & 0x3F));
        bytes.push(0x80 | (cp & 0x3F));
      }
    }
    bytes.push(0); // null terminator
    const buf = Native.callSymbol("malloc", BigInt(bytes.length));
    if (!buf) return 0n;
    const ab = new ArrayBuffer(bytes.length);
    new Uint8Array(ab).set(bytes);
    Native.write(buf, ab);
    // CFStringCreateWithCString with kCFStringEncodingUTF8 = 0x08000100
    const cf = Native.callSymbol("CFStringCreateWithCString", 0n, buf, 0x08000100);
    Native.callSymbol("free", buf);
    return cf;
  }

  // === NSInvocation helpers ============================================
  // These let us call methods that take double / CGRect / CGSize / CGPoint
  // arguments without having to set ARM64 V registers. NSInvocation marshals
  // arguments through setArgument:atIndex: + memcpy and is calling-convention
  // agnostic.

  let _NSInvocationCls = 0n;
  function nsInvocationClass() {
    if (!isNonZero(_NSInvocationCls)) {
      _NSInvocationCls = Native.callSymbol("objc_getClass", "NSInvocation");
    }
    return _NSInvocationCls;
  }

  // Build a new NSInvocation by asking the target object for the method
  // signature of the given selector. Sets target + selector but no args yet.
  function newInvocationFromTarget(target, selectorName) {
    if (!isNonZero(target)) return 0n;
    const sig = objc(target, "methodSignatureForSelector:", sel(selectorName));
    if (!isNonZero(sig)) {
      log("methodSignatureForSelector: nil for " + selectorName);
      return 0n;
    }
    const invClass = nsInvocationClass();
    if (!isNonZero(invClass)) {
      log("newInvocationFromTarget: NSInvocation class missing");
      return 0n;
    }
    if (!requireSelector(invClass, "invocationWithMethodSignature:", "NSInvocation(class)")) {
      log("newInvocationFromTarget: NSInvocation missing invocationWithMethodSignature:");
      return 0n;
    }
    const inv = objc(invClass, "invocationWithMethodSignature:", sig);
    if (!isNonZero(inv)) {
      log("newInvocationFromTarget: invocationWithMethodSignature failed for " + selectorName);
      return 0n;
    }
    // Pin the invocation object lifetime explicitly for this no-ARC JS bridge.
    if (canRespond(inv, "retain")) objc(inv, "retain");
    if (!requireSelector(inv, "setTarget:", "NSInvocation(instance)")) {
      log("newInvocationFromTarget: invocation missing setTarget:");
      return 0n;
    }
    if (!requireSelector(inv, "setSelector:", "NSInvocation(instance)")) {
      log("newInvocationFromTarget: invocation missing setSelector:");
      return 0n;
    }
    probe("newInvocationFromTarget sel=" + selectorName + " target=0x" + u64(target).toString(16) + " inv=0x" + u64(inv).toString(16));
    objc(inv, "setTarget:", target);
    objc(inv, "setSelector:", sel(selectorName));
    return inv;
  }

  // Same as above but for class methods on a class object.
  function newInvocationFromClass(cls, selectorName) {
    return newInvocationFromTarget(cls, selectorName);
  }

  // Marshal helpers - write a JS value into a freshly malloc'd buffer in the
  // shape NSInvocation expects, then call setArgument:atIndex:.
  function setInvDoubleArg(inv, value, idx) {
    const buf = Native.callSymbol("malloc", 8n);
    const ab = new ArrayBuffer(8);
    new DataView(ab).setFloat64(0, value, true);
    Native.write(buf, ab);
    objc(inv, "setArgument:atIndex:", buf, BigInt(idx));
    Native.callSymbol("free", buf);
  }

  function setInvPointerArg(inv, ptr, idx) {
    const buf = Native.callSymbol("malloc", 8n);
    const ab = new ArrayBuffer(8);
    new DataView(ab).setBigUint64(0, u64(ptr), true);
    Native.write(buf, ab);
    objc(inv, "setArgument:atIndex:", buf, BigInt(idx));
    Native.callSymbol("free", buf);
  }

  function setInvBoolArg(inv, value, idx) {
    const buf = Native.callSymbol("malloc", 1n);
    const ab = new ArrayBuffer(1);
    new Uint8Array(ab)[0] = value ? 1 : 0;
    Native.write(buf, ab);
    objc(inv, "setArgument:atIndex:", buf, BigInt(idx));
    Native.callSymbol("free", buf);
  }

  // CGRect = struct { CGFloat x, y, w, h; } = 4 doubles = 32 bytes.
  function setInvCGRectArg(inv, rect, idx) {
    const buf = Native.callSymbol("malloc", 32n);
    const ab = new ArrayBuffer(32);
    const dv = new DataView(ab);
    dv.setFloat64(0, rect.x, true);
    dv.setFloat64(8, rect.y, true);
    dv.setFloat64(16, rect.w, true);
    dv.setFloat64(24, rect.h, true);
    Native.write(buf, ab);
    objc(inv, "setArgument:atIndex:", buf, BigInt(idx));
    Native.callSymbol("free", buf);
  }

  // After invoke, retrieve a pointer-typed return value.
  function getInvPointerReturn(inv) {
    const buf = Native.callSymbol("malloc", 8n);
    objc(inv, "getReturnValue:", buf);
    const ret = Native.readPtr(buf);
    Native.callSymbol("free", buf);
    return ret;
  }

  // === Network speed reader ============================================
  // Walk getifaddrs() linked list manually. Sums ifi_ibytes / ifi_obytes
  // across all en* and pdp_ip* interfaces with AF_LINK family. Returns
  // BigInt totals because the counters are u_int32_t (4 GB) but we want
  // to handle long-uptime wraparound cleanly.
  //
  // Darwin struct ifaddrs layout:
  //   +0   struct ifaddrs *ifa_next
  //   +8   char *ifa_name
  //   +16  unsigned int ifa_flags + 4 bytes pad
  //   +24  struct sockaddr *ifa_addr
  //   +32  struct sockaddr *ifa_netmask
  //   +40  struct sockaddr *ifa_dstaddr
  //   +48  void *ifa_data    (points to struct if_data on AF_LINK ifaddrs)
  //
  // struct sockaddr layout:
  //   +0   u_char sa_len
  //   +1   sa_family_t sa_family   (1 byte on Darwin)
  //   +2   ...
  //
  // struct if_data layout (Darwin, the relevant prefix):
  //   +0   u_char ifi_type, typelen, physical, addrlen,
  //               hdrlen, recvquota, xmitquota, unused1
  //   +8   u_int32_t ifi_mtu
  //   +12  u_int32_t ifi_metric
  //   +16  u_int32_t ifi_baudrate
  //   +20  u_int32_t ifi_ipackets
  //   +24  u_int32_t ifi_ierrors
  //   +28  u_int32_t ifi_opackets
  //   +32  u_int32_t ifi_oerrors
  //   +36  u_int32_t ifi_collisions
  //   +40  u_int32_t ifi_ibytes      <-- the one we want
  //   +44  u_int32_t ifi_obytes      <-- the one we want
  //
  // AF_LINK = 18.
  function getNetworkBytes() {
    const listPP = Native.callSymbol("malloc", 8n);
    const zero = new ArrayBuffer(8);
    Native.write(listPP, zero);

    const ret = Native.callSymbol("getifaddrs", listPP);
    if (Number(ret) !== 0) {
      Native.callSymbol("free", listPP);
      return { in: 0n, out: 0n };
    }

    let totalIn = 0n;
    let totalOut = 0n;
    const listHead = Native.readPtr(listPP);
    let cur = listHead;
    let safety = 0;

    while (isNonZero(cur) && safety++ < 256) {
      const next = Native.readPtr(cur);
      const namePtr = Native.readPtr(cur + 8n);
      const addrPtr = Native.readPtr(cur + 24n);
      const dataPtr = Native.readPtr(cur + 48n);

      if (isNonZero(namePtr) && isNonZero(addrPtr) && isNonZero(dataPtr)) {
        const name = Native.readString(namePtr, 16);
        const isEn = name.indexOf("en") === 0;
        const isPdp = name.indexOf("pdp_ip") === 0;
        if (isEn || isPdp) {
          const familyByte = new Uint8Array(Native.read(addrPtr + 1n, 1))[0];
          if (familyByte === 18) {
            const dataBytes = Native.read(dataPtr, 48);
            const dv = new DataView(dataBytes);
            const ibytes = BigInt(dv.getUint32(40, true));
            const obytes = BigInt(dv.getUint32(44, true));
            totalIn += ibytes;
            totalOut += obytes;
          }
        }
      }
      cur = next;
    }

    Native.callSymbol("freeifaddrs", listHead);
    Native.callSymbol("free", listPP);
    return { in: totalIn, out: totalOut };
  }

  function formatSpeed(bytesBig) {
    const bytes = Number(bytesBig);
    if (bytes < KB) return "0 KB/s";
    if (bytes < MB) return Math.floor(bytes / KB) + " KB/s";
    if (bytes < GB) return (bytes / MB).toFixed(2) + " MB/s";
    return (bytes / GB).toFixed(2) + " GB/s";
  }

  // === Tick (runs on main thread when timer fires) =====================
  function tsTick() {
    try {
      const state = globalThis.__ts_state;
      if (!state || !isNonZero(state.label)) {
        return;
      }
      const cur = getNetworkBytes();
      let inDiff = 0n;
      let outDiff = 0n;
      if (state.prevIn > 0n && cur.in >= state.prevIn) inDiff = cur.in - state.prevIn;
      if (state.prevOut > 0n && cur.out >= state.prevOut) outDiff = cur.out - state.prevOut;
      state.prevIn = cur.in;
      state.prevOut = cur.out;

      const downStr = formatSpeed(inDiff);
      const upStr = formatSpeed(outDiff);
      // \u25BC = down arrow, \u25B2 = up arrow. JS escapes keep this source
      // file ASCII clean while still rendering as unicode glyphs at runtime.
      const text = "\u25BC " + downStr + "   \u25B2 " + upStr;
      const cf = cfstrUtf8(text);
      if (isNonZero(cf)) {
        objc(state.label, "setText:", cf);
        // setText: copies the string into the label, so we can release ours.
        Native.callSymbol("CFRelease", cf);
      }
    } catch (e) {
      log("tsTick ERR: " + String(e));
    }
  }

  // === Setup (runs on main thread, builds the HUD + schedules timer) ===
  function tsSetup() {
    try {
      probe("tsSetup begin mask=0x" + TS_STAGE_MASK.toString(16));
      const UIApplication = Native.callSymbol("objc_getClass", "UIApplication");
      if (!isNonZero(UIApplication)) { log("tsSetup: UIApplication class missing"); return; }
      if (!requireSelector(UIApplication, "sharedApplication", "UIApplication")) { log("tsSetup: no sharedApplication"); return; }
      const app = objc(UIApplication, "sharedApplication");
      if (!isNonZero(app)) { log("tsSetup: no UIApplication"); return; }

      let keyWindow = 0n;
      if (requireSelector(app, "keyWindow", "app")) {
        probe("before app keyWindow");
        keyWindow = objc(app, "keyWindow");
        probe("after app keyWindow=0x" + u64(keyWindow).toString(16));
      }
      if (!isNonZero(keyWindow)) {
        if (!requireSelector(app, "windows", "app")) { log("tsSetup: no windows selector"); return; }
        probe("before app windows");
        const windows = objc(app, "windows");
        probe("after app windows=0x" + u64(windows).toString(16));
        if (isNonZero(windows)) {
          if (!requireSelector(windows, "count", "windows")) { log("tsSetup: windows missing count"); return; }
          const count = u64(objc(windows, "count"));
          if (count > 0n) {
            if (!requireSelector(windows, "objectAtIndex:", "windows")) { log("tsSetup: windows missing objectAtIndex:"); return; }
            keyWindow = objc(windows, "objectAtIndex:", 0n);
          }
        }
      }
      if (!isNonZero(keyWindow)) { log("tsSetup: no keyWindow"); return; }
      probe("window ok=0x" + u64(keyWindow).toString(16));

      // Create the label
      const UILabel = Native.callSymbol("objc_getClass", "UILabel");
      if (!isNonZero(UILabel)) { log("tsSetup: UILabel class missing"); return; }
      if (!requireSelector(UILabel, "alloc", "UILabel")) { log("tsSetup: UILabel alloc missing"); return; }
      const labelAlloc = objc(UILabel, "alloc");
      if (!requireSelector(labelAlloc, "init", "UILabel alloc")) { log("tsSetup: UILabel init missing"); return; }
      const label = objc(labelAlloc, "init");
      if (!isNonZero(label)) { log("tsSetup: UILabel init failed"); return; }
      probe("label ok=0x" + u64(label).toString(16));

      // Set frame via NSInvocation (CGRect is HFA, can't pass via X regs)
      if (stageEnabled(TS_STAGE_SET_FRAME)) {
        if (!requireSelector(label, "setFrame:", "UILabel")) { log("tsSetup: setFrame selector missing"); return; }
        probe("S1 before setFrame");
        const setFrameInv = newInvocationFromTarget(label, "setFrame:");
        if (!isNonZero(setFrameInv)) { log("tsSetup: setFrame invocation failed"); return; }
        setInvCGRectArg(setFrameInv, HUD_FRAME, 2);
        objc(setFrameInv, "invoke");
        probe("S1 after setFrame");
      } else {
        probe("S1 skipped setFrame");
      }

      // Style: white text on opaque black background, centered, monospaced
      if (stageEnabled(TS_STAGE_STYLE)) {
        const UIColor = Native.callSymbol("objc_getClass", "UIColor");
        if (!isNonZero(UIColor)) { log("tsSetup: UIColor class missing"); return; }
        if (!requireSelector(UIColor, "whiteColor", "UIColor")) { log("tsSetup: whiteColor missing"); return; }
        if (!requireSelector(UIColor, "blackColor", "UIColor")) { log("tsSetup: blackColor missing"); return; }
        if (!requireSelector(label, "setTextColor:", "UILabel")) { log("tsSetup: setTextColor missing"); return; }
        if (!requireSelector(label, "setBackgroundColor:", "UILabel")) { log("tsSetup: setBackgroundColor missing"); return; }
        if (!requireSelector(label, "setTextAlignment:", "UILabel")) { log("tsSetup: setTextAlignment missing"); return; }
        probe("S2 before style");
        const whiteColor = objc(UIColor, "whiteColor");
        const blackColor = objc(UIColor, "blackColor");
        objc(label, "setTextColor:", whiteColor);
        objc(label, "setBackgroundColor:", blackColor);
        objc(label, "setTextAlignment:", 1n); // NSTextAlignmentCenter = 1
        probe("S2 after style");
      } else {
        probe("S2 skipped style");
      }

      // Set font: [UIFont systemFontOfSize:HUD_FONT_SIZE] - takes a double
      if (stageEnabled(TS_STAGE_FONT)) {
        const UIFont = Native.callSymbol("objc_getClass", "UIFont");
        if (!isNonZero(UIFont)) { log("tsSetup: UIFont class missing"); return; }
        if (!requireSelector(UIFont, "systemFontOfSize:", "UIFont")) { log("tsSetup: systemFontOfSize missing"); return; }
        if (!requireSelector(label, "setFont:", "UILabel")) { log("tsSetup: setFont missing"); return; }
        probe("S3 before font");
        const fontInv = newInvocationFromClass(UIFont, "systemFontOfSize:");
        if (isNonZero(fontInv)) {
          setInvDoubleArg(fontInv, HUD_FONT_SIZE, 2);
          objc(fontInv, "invoke");
          const font = getInvPointerReturn(fontInv);
          if (isNonZero(font)) {
            objc(label, "setFont:", font);
          }
        }
        probe("S3 after font");
      } else {
        probe("S3 skipped font");
      }

      // Initial text so the user sees something immediately even before the
      // first timer tick.
      if (!requireSelector(label, "setText:", "UILabel")) { log("tsSetup: setText missing"); return; }
      const initialText = cfstrUtf8("\u25BC 0 KB/s   \u25B2 0 KB/s");
      if (isNonZero(initialText)) {
        objc(label, "setText:", initialText);
        Native.callSymbol("CFRelease", initialText);
      }

      // Round the corners a bit so it doesn't look like a debug overlay
      if (stageEnabled(TS_STAGE_LAYER)) {
        if (!requireSelector(label, "layer", "UILabel")) { log("tsSetup: layer selector missing"); return; }
        probe("S4 before layer");
        const labelLayer = objc(label, "layer");
        if (isNonZero(labelLayer)) {
          if (!requireSelector(labelLayer, "setCornerRadius:", "CALayer")) { log("tsSetup: setCornerRadius missing"); return; }
          if (!requireSelector(labelLayer, "setMasksToBounds:", "CALayer")) { log("tsSetup: setMasksToBounds missing"); return; }
          const setCRInv = newInvocationFromTarget(labelLayer, "setCornerRadius:");
          if (isNonZero(setCRInv)) {
            setInvDoubleArg(setCRInv, 6.0, 2);
            objc(setCRInv, "invoke");
          }
          objc(labelLayer, "setMasksToBounds:", 1n);
        }
        probe("S4 after layer");
      } else {
        probe("S4 skipped layer");
      }

      // Add to keyWindow so it actually shows up
      if (stageEnabled(TS_STAGE_ADD_SUBVIEW)) {
        if (!requireSelector(keyWindow, "addSubview:", "keyWindow")) { log("tsSetup: addSubview missing"); return; }
        probe("S5 before addSubview");
        objc(keyWindow, "addSubview:", label);
        probe("S5 after addSubview");
      } else {
        probe("S5 skipped addSubview");
      }

      // Stash the label + state so the tick handler can find it
      globalThis.__ts_state = {
        label: label,
        prevIn: 0n,
        prevOut: 0n,
      };

      // Retain the label so it survives any ARC fallout from this scope
      objc(label, "retain");

      // Build the inner NSInvocation: [jsctx evaluateScript:@"__ts_tick()"]
      const jsctxObj = globalThis.__ts_jsctx_obj;
      if (!isNonZero(jsctxObj)) { log("tsSetup: no jsctxObj for timer"); return; }
      if (stageEnabled(TS_STAGE_TIMER)) {
        if (!requireSelector(jsctxObj, "evaluateScript:", "JSContext")) { log("tsSetup: evaluateScript missing"); return; }
        probe("S6 before timer");
        const innerInv = newInvocationFromTarget(jsctxObj, "evaluateScript:");
        if (!isNonZero(innerInv)) { log("tsSetup: evaluateScript invocation build failed"); return; }
        const tickScript = cfstrUtf8("globalThis.__ts_tick && __ts_tick()");
        setInvPointerArg(innerInv, tickScript, 2);
        // retainArguments tells the invocation to retain everything we passed,
        // so the cfstring stays alive for as long as the invocation lives.
        objc(innerInv, "retainArguments");
        objc(innerInv, "retain");

        // Build the outer NSInvocation:
        //   [NSTimer scheduledTimerWithTimeInterval:1.0
        //                                invocation:innerInv
        //                                   repeats:YES]
        // The first arg (NSTimeInterval = double) is the reason we have to use
        // NSInvocation here instead of a direct objc_msgSend.
        const NSTimer = Native.callSymbol("objc_getClass", "NSTimer");
        if (!isNonZero(NSTimer)) { log("tsSetup: NSTimer class missing"); return; }
        if (!requireSelector(NSTimer, "scheduledTimerWithTimeInterval:invocation:repeats:", "NSTimer")) {
          log("tsSetup: scheduledTimerWithTimeInterval:invocation:repeats: missing");
          return;
        }
        const outerInv = newInvocationFromClass(NSTimer, "scheduledTimerWithTimeInterval:invocation:repeats:");
        if (!isNonZero(outerInv)) { log("tsSetup: scheduledTimer invocation build failed"); return; }
        setInvDoubleArg(outerInv, HUD_UPDATE_INTERVAL_SEC, 2);
        setInvPointerArg(outerInv, innerInv, 3);
        setInvBoolArg(outerInv, true, 4);
        objc(outerInv, "invoke");

        const timer = getInvPointerReturn(outerInv);
        if (isNonZero(timer)) {
          objc(timer, "retain");
          globalThis.__ts_state.timer = timer;
        }
        globalThis.__ts_state.innerInv = innerInv;
        probe("S6 after timer");
      } else {
        probe("S6 skipped timer");
      }
      log("tsSetup done");
    } catch (e) {
      log("tsSetup ERR: " + String(e));
    }
  }

  function runOnMainEvaluate(script) {
    const jsctxObj = globalThis.__ts_jsctx_obj;
    if (!isNonZero(jsctxObj)) {
      log("runOnMainEvaluate: no jsctxObj");
      return false;
    }
    if (!canRespond(jsctxObj, "evaluateScript:")) {
      log("runOnMainEvaluate: jsctxObj missing evaluateScript:");
      return false;
    }
    if (!canRespond(jsctxObj, "performSelectorOnMainThread:withObject:waitUntilDone:")) {
      log("runOnMainEvaluate: jsctxObj missing performSelectorOnMainThread");
      return false;
    }
    const cf = cfstrUtf8(script);
    if (!isNonZero(cf)) return false;
    // Keep this asynchronous. waitUntilDone:YES can deadlock because the worker
    // thread still holds JavaScriptCore VM state while the main thread tries to
    // evaluate the script and take the same VM lock.
    objc(jsctxObj, "performSelectorOnMainThread:withObject:waitUntilDone:", sel("evaluateScript:"), cf, 0);
    // Don't CFRelease the cfstring on this thread - the main thread retains
    // it via performSelector's autorelease pool. Releasing here would race
    // and cause PAC violations on the release path. Same lesson learned in
    // fiveicondock_light.js.
    return true;
  }

  try {
    log("=== trollspeed_light.js entry ===");
    Native.init();
    log("Native.init ok, baseAddr=0x" + new BigUint64Array(nativeCallBuff)[20].toString(16));

    const bi = Native.bridgeInfo();
    globalThis.__ts_jsctx_obj = bi.jsContextObj;
    globalThis.__ts_setup = tsSetup;
    globalThis.__ts_tick = tsTick;
    globalThis.__ts_log = log;
    globalThis.__ts_stage_mask = TS_STAGE_MASK;
    log("jsctxObj=0x" + u64(bi.jsContextObj).toString(16));

    const required = ["UIApplication", "UILabel", "UIColor", "UIFont", "NSTimer", "NSInvocation", "NSMethodSignature", "JSContext"];
    const missing = [];
    for (let i = 0; i < required.length; i++) {
      const c = Native.callSymbol("objc_getClass", required[i]);
      if (!isNonZero(c)) missing.push(required[i]);
    }
    if (missing.length > 0) {
      log("aborting - missing classes: " + missing.join(","));
      return;
    }
    probe("class preflight ok");

    // Sanity check we are inside SpringBoard
    const sbIconControllerClass = Native.callSymbol("objc_getClass", "SBIconController");
    log("probe SBIconController=0x" + u64(sbIconControllerClass).toString(16) + (sbIconControllerClass ? " (SpringBoard OK)" : " (WRONG PROCESS)"));
    if (!isNonZero(sbIconControllerClass)) {
      log("aborting - not running inside SpringBoard");
      return;
    }

    // Dispatch tsSetup to the main thread. The setup builds the UIWindow
    // hierarchy and schedules the recurring NSTimer. Once that's done, this
    // worker thread can exit and the timer keeps firing from the main run
    // loop, calling __ts_tick() once per second.
    log("dispatching tsSetup to main thread");
    runOnMainEvaluate("try{globalThis.__ts_setup && __ts_setup()}catch(e){globalThis.__ts_log && __ts_log('setup dispatch err: '+e)}");
    // CRITICAL: do NOT call log() (or any Native.callSymbol) here on the
    // injected worker thread. Native.callSymbol writes to the shared
    // nativeCallBuff at fixed offsets - it is NOT thread-safe. Main thread
    // starts running tsSetup (which does ~50 bridge calls + diagnostic logs)
    // on the next run loop turn, and any bridge call from this worker thread
    // after the dispatch will corrupt main thread's nativeCallBuff arg/return
    // slots mid-objc_msgSend. The worker thread's last action must be the
    // performSelectorOnMainThread dispatch itself. Fall off the IIFE silently.
  } catch (e) {
    log("fatal: " + String(e) + " stack: " + (e.stack || "N/A"));
  }
})();
