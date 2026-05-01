(() => {
  const STATUS_PATH = globalThis.__ls_chain_status_path || globalThis.__bb_chain_status_path || "/private/var/tmp/lightsaber_chain_status.log";
  const COMPLETE_MARKER = globalThis.__ls_chain_status_complete_marker || globalThis.__bb_chain_status_complete_marker || "[PE] start() completed successfully";
  const POLL_INTERVAL_US = 1500000;
  const POLL_MAX_ITERS = 2400;
  const MAX_READ_BYTES = 16384;
  const MAX_LINES = 8;
  const FILTER_RE = /\[PE\]|\[PE-DBG\]|\[SBX1\]|\[SBC\]|\[POWERCUFF\]|\[FILE-DL\]|\[FILE-DL-EARLY\]|\[HTTP-UPLOAD\]|\[APP\]|\[ICLOUD\]|\[KEYCHAIN\]|\[WIFI\]|\[THREEAPP\]|\[THREEAPP-AUDIT\]|\[SAFARI-CLEAN\]|\[MG\]|\[MPD\]|\[APPLIMIT\]|\[CHAIN-OVL\]|nativeCallBuff|kernel_base|kernel_slide|SBX0|SBX1|sbx0:|sbx1:|MIG_FILTER_BYPASS |INJECTJS |CHAIN |DRIVER-POSTEXPL |DRIVER-NEWTHREAD |DARKSWORD-WIFI-DUMP |INFO |OFFSETS |FILE-UTILS |PORTRIGHTINSERTER |REGISTERSSTRUCT |REMOTECALL |TASK(?:ROP)? |THREAD |VM |MAIN |EXCEPTION |SANDBOX |PAC (?:diagnostics|ptrs|gadget)|UTILS |^\[[+\-!i]\]\s/i;

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
        let len = left > 0x1000 ? 0x1000 : left;
        buff8.set(new Uint8Array(buff, offs, len), 0x1000);
        this.#nativeCallAddr(this.#memcpyAddr, ptr + BigInt(offs), this.#baseAddr + 0x1000n, BigInt(len));
        left -= len;
        offs += len;
      }
      return true;
    }

    static read(ptr, length) {
      const buff = new ArrayBuffer(length);
      const buff8 = new Uint8Array(buff);
      let offs = 0;
      let left = length;
      while (left) {
        let len = left > 0x1000 ? 0x1000 : left;
        this.#nativeCallAddr(this.#memcpyAddr, this.#baseAddr + 0x1000n, ptr + BigInt(offs), BigInt(len));
        buff8.set(new Uint8Array(nativeCallBuff, 0x1000, len), offs);
        left -= len;
        offs += len;
      }
      return buff;
    }

    static readString(ptr, len = 512) {
      return this.bytesToString(this.read(ptr, len), false);
    }

    static writeString(ptr, str) {
      this.write(ptr, this.stringToBytes(str, true));
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
      for (let i = 0; i < str.length; i++) s8[i] = str.charCodeAt(i) & 0xff;
      if (nullTerminated) s8[str.length] = 0;
      return buff;
    }

    static bridgeInfo() {
      const buff = new BigUint64Array(nativeCallBuff);
      return { jsContextObj: buff[33] };
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
      new Uint8Array(nativeCallBuff).set(new Uint8Array(nameBytes), 0x1000);
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
      if (!funcAddr) {
        this.#argPtr = this.#argMem;
        return 0n;
      }
      const ret64 = this.#nativeCallAddr(funcAddr, x0, x1, x2, x3, x4, x5, x6, x7);
      this.#argPtr = this.#argMem;
      if (ret64 === 0xffffffffffffffffn) return -1;
      if (ret64 < 0xffffffffn && ret64 > -0xffffffffn) return Number(ret64);
      return ret64;
    }
  }

  function u64(v) {
    if (!v) return 0n;
    return BigInt.asUintN(64, BigInt(v));
  }

  function isNonZero(v) {
    return u64(v) !== 0n;
  }

  function sel(name) {
    return Native.callSymbol("sel_registerName", name);
  }

  function objc(obj, selectorName, ...args) {
    return Native.callSymbol("objc_msgSend", obj, sel(selectorName), ...args);
  }

  function cfstr(str) {
    return Native.callSymbol("CFStringCreateWithCString", 0n, str, 0x08000100);
  }

  function nsStr(str) {
    const NSString = Native.callSymbol("objc_getClass", "NSString");
    return objc(NSString, "stringWithUTF8String:", str);
  }

  function log(msg) {
    try {
      const tagged = "[CHAIN-OVL] " + msg;
      const ptr = Native.callSymbol("malloc", BigInt(tagged.length + 1));
      if (!ptr) return;
      Native.writeString(ptr, tagged);
      Native.callSymbol("syslog", 5, ptr);
      Native.callSymbol("free", ptr);
    } catch (_) {}
  }

  function runOnMainEvaluate(script) {
    const jsctxObj = globalThis.__bb_chain_overlay_jsctx_obj;
    if (!isNonZero(jsctxObj)) return false;
    const s = cfstr(script);
    objc(jsctxObj, "performSelectorOnMainThread:withObject:waitUntilDone:", sel("evaluateScript:"), s, 0);
    return true;
  }

  function readStatusFile() {
    const fd = Native.callSymbol("open", STATUS_PATH, 0);
    if (Number(fd) < 0) return "";
    let buf = 0n;
    try {
      const endRaw = Native.callSymbol("lseek", fd, 0n, 2n);
      const end = Number(endRaw);
      if (!end || end < 0) return "";
      const start = end > MAX_READ_BYTES ? end - MAX_READ_BYTES : 0;
      Native.callSymbol("lseek", fd, BigInt(start), 0n);
      const want = end - start;
      buf = Native.callSymbol("malloc", BigInt(want + 1));
      if (!buf || buf === 0n) return "";
      const got = Number(Native.callSymbol("read", fd, buf, want));
      if (got <= 0) return "";
      return Native.bytesToString(Native.read(buf, got), false);
    } finally {
      if (buf) Native.callSymbol("free", buf);
      Native.callSymbol("close", fd);
    }
  }

  function compactLine(line) {
    let s = String(line || "").replace(/\s+/g, " ").trim();
    if (s.length > 92) s = s.slice(0, 89) + "...";
    return s;
  }

  function filteredLines(text) {
    const out = [];
    const seen = {};
    const raw = String(text || "").split(/\n/);
    for (let i = 0; i < raw.length; i++) {
      let line = raw[i].replace(/\r/g, "").trim();
      if (!line || !FILTER_RE.test(line)) continue;
      line = compactLine(line);
      if (!line || seen[line]) continue;
      seen[line] = true;
      out.push(line);
    }
    return out;
  }

  function buildOverlayText() {
    const lines = filteredLines(readStatusFile());
    let done = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].indexOf(COMPLETE_MARKER) >= 0) done = true;
    }
    const tail = lines.slice(lines.length > MAX_LINES ? lines.length - MAX_LINES : 0);
    globalThis.__bb_chain_overlay_done = done;
    if (done) return "LS COMPLETE: [PE] start() completed successfully";
    if (!tail.length) return "LS waiting for chain status";
    let tick = Number(globalThis.__bb_chain_overlay_tick || 0);
    globalThis.__bb_chain_overlay_tick = tick + 1;
    let line = tail[tick % tail.length];
    line = line.replace(/^.*?(\[PE\]|\[PE-DBG\]|\[SBX1\]|\[MPD\]|\[SAFARI-CLEAN\]|\[THREEAPP\]|\[CHAIN-OVL\])/, "$1");
    let out = "LS " + line;
    if (out.length > 64) out = out.slice(0, 61) + "...";
    return out;
  }

  function resolveStatusBarClasses() {
    return {
      cls17: Native.callSymbol("objc_getClass", "STUIStatusBarStringView"),
      cls16: Native.callSymbol("objc_getClass", "_UIStatusBarStringView")
    };
  }

  function walkFindStatusBarLabels(view, cls1, cls2, out, depth, visited) {
    if (depth > 10 || out.length >= 8) return;
    if (!isNonZero(view)) return;
    visited[0] = visited[0] + 1;
    if (isNonZero(cls1) && isNonZero(objc(view, "isKindOfClass:", cls1))) {
      out.push(view);
      return;
    }
    if (isNonZero(cls2) && isNonZero(objc(view, "isKindOfClass:", cls2))) {
      out.push(view);
      return;
    }
    const subs = objc(view, "subviews");
    if (!isNonZero(subs)) return;
    let cnt = Number(u64(objc(subs, "count")));
    if (cnt > 48) cnt = 48;
    for (let i = 0; i < cnt; i++) {
      const sub = objc(subs, "objectAtIndex:", BigInt(i));
      walkFindStatusBarLabels(sub, cls1, cls2, out, depth + 1, visited);
      if (out.length >= 8) break;
    }
  }

  function findStatusBarLabel() {
    const cached = globalThis.__bb_chain_overlay_label;
    if (isNonZero(cached)) return cached;
    const UIApplication = Native.callSymbol("objc_getClass", "UIApplication");
    if (!isNonZero(UIApplication)) {
      log("UIApplication missing");
      return 0n;
    }
    const classes = resolveStatusBarClasses();
    if (!isNonZero(classes.cls17) && !isNonZero(classes.cls16)) {
      log("status bar string classes missing");
      return 0n;
    }
    const app = objc(UIApplication, "sharedApplication");
    if (!isNonZero(app)) {
      log("sharedApplication missing");
      return 0n;
    }
    const keyWin = objc(app, "keyWindow");
    if (!isNonZero(keyWin)) {
      log("keyWindow missing");
      return 0n;
    }
    const scene = objc(keyWin, "windowScene");
    if (!isNonZero(scene)) {
      log("windowScene missing");
      return 0n;
    }
    const sceneWins = objc(scene, "windows");
    if (!isNonZero(sceneWins)) {
      log("scene.windows missing");
      return 0n;
    }
    let winCount = Number(u64(objc(sceneWins, "count")));
    if (winCount > 16) winCount = 16;
    const candidates = [];
    const visited = [0];
    for (let i = 0; i < winCount; i++) {
      const win = objc(sceneWins, "objectAtIndex:", BigInt(i));
      walkFindStatusBarLabels(win, classes.cls17, classes.cls16, candidates, 0, visited);
      if (candidates.length >= 8) break;
    }
    if (!candidates.length) {
      log("no status bar labels visited=" + visited[0]);
      return 0n;
    }
    const colon = nsStr(":");
    for (let i = 0; i < candidates.length; i++) {
      const txt = objc(candidates[i], "text");
      if (isNonZero(txt) && isNonZero(objc(txt, "containsString:", colon))) {
        globalThis.__bb_chain_overlay_label = candidates[i];
        log("using clock status label candidate=" + i);
        return candidates[i];
      }
    }
    globalThis.__bb_chain_overlay_label = candidates[0];
    log("using status label candidate=0");
    return candidates[0];
  }

  function ensureOverlay() {
    return isNonZero(findStatusBarLabel());
  }

  function updateOverlay() {
    if (!ensureOverlay()) return false;
    const target = globalThis.__bb_chain_overlay_label;
    if (!isNonZero(target)) return false;
    objc(target, "setText:", nsStr(globalThis.__bb_chain_overlay_text || "BrokenBlade: waiting"));
    return true;
  }

  try {
    Native.init();
    globalThis.__bb_chain_overlay_jsctx_obj = Native.bridgeInfo().jsContextObj;
    globalThis.__bb_chain_overlay_log = log;
    globalThis.__bb_chain_overlay_update = updateOverlay;
    log("entry statusPath=" + STATUS_PATH);
    for (let i = 0; i < POLL_MAX_ITERS; i++) {
      globalThis.__bb_chain_overlay_text = buildOverlayText();
      runOnMainEvaluate("try{__bb_chain_overlay_update();}catch(e){__bb_chain_overlay_log('update error '+e);}");
      if (globalThis.__bb_chain_overlay_done && i > 4) break;
      Native.callSymbol("usleep", POLL_INTERVAL_US);
    }
    log("poll loop exit done=" + !!globalThis.__bb_chain_overlay_done);
  } catch (e) {
    try { log("fatal " + String(e)); } catch (_) {}
  }
})();
