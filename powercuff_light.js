// @param:text|__powercuff_level|Thermal mode (off/nominal/light/moderate/heavy)|nominal
(() => {
  // powercuff_light.js
  //
  // Port of rpetrich's Powercuff thermal-throttle tweak
  // (https://github.com/rpetrich/Powercuff) to the lightsaber JS-injection
  // chain's daemon-injection primitive instead of a Cydia-style dylib. All
  // credit for the original tweak design and the discovery of the
  // putDeviceInThermalSimulationMode: API goes to rpetrich.
  //
  // Runs *inside thermalmonitord*, walks +[CPMSHelper sharedInstance] to the
  // live CommonProduct singleton, and calls putDeviceInThermalSimulationMode:
  // with whichever level the user picked at install time. The daemon then
  // synthesises that thermal pressure for every CLTM client until reboot or
  // until thermalmonitord re-evaluates and overrides simulation state.
  //
  // The level is selected in index.html's level-picker dialog and propagated
  // through the worker postMessage chain into globalThis.__powercuff_level
  // before this payload is sent to thermalmonitord. Accepted values:
  // off / nominal / light / moderate / heavy. Defaults to heavy if unset.

  const VALID_MODES = { off: 1, nominal: 1, light: 1, moderate: 1, heavy: 1 };
  let __requested = (typeof globalThis.__powercuff_level === 'string') ? globalThis.__powercuff_level : 'heavy';
  if (!VALID_MODES[__requested]) __requested = 'heavy';
  const THERMAL_MODE = __requested;

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
      const tagged = "[POWERCUFF] " + msg;
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

  function cfstr(str) {
    return Native.callSymbol("CFStringCreateWithCString", 0n, str, 0x08000100);
  }

  function canRespond(obj, selectorName) {
    if (!isNonZero(obj)) return false;
    const ret = objc(obj, "respondsToSelector:", sel(selectorName));
    return isNonZero(ret);
  }

  function readIvarPtr(obj, ivarName) {
    if (!isNonZero(obj)) return 0n;
    const cls = Native.callSymbol("object_getClass", obj);
    if (!isNonZero(cls)) return 0n;
    const ivar = Native.callSymbol("class_getInstanceVariable", cls, ivarName);
    if (!isNonZero(ivar)) return 0n;
    const offset = Number(Native.callSymbol("ivar_getOffset", ivar));
    return Native.readPtr(u64(obj) + BigInt(offset));
  }

  function applyThermal() {
    log("=== powercuff_light entry === target=" + THERMAL_MODE);

    // CPMSHelper is thermalmonitord's PPM-side singleton; -[CPMSHelper setProduct:]
    // is called from -[CommonProduct initProduct:] right at the end of init, so by
    // the time the daemon is up the singleton's productObj ivar holds the live
    // CommonProduct instance we need.
    const CPMSHelperClass = Native.callSymbol("objc_getClass", "CPMSHelper");
    if (!isNonZero(CPMSHelperClass)) {
      log("CPMSHelper class missing - wrong process? (expected thermalmonitord)");
      return false;
    }
    log("CPMSHelper=0x" + u64(CPMSHelperClass).toString(16));

    const helper = objc(CPMSHelperClass, "sharedInstance");
    if (!isNonZero(helper)) {
      log("+[CPMSHelper sharedInstance] returned nil");
      return false;
    }
    log("helper=0x" + u64(helper).toString(16));

    const product = readIvarPtr(helper, "productObj");
    if (!isNonZero(product)) {
      log("CPMSHelper.productObj is nil - daemon may not have finished initProduct: yet");
      return false;
    }
    log("product=0x" + u64(product).toString(16));

    if (!canRespond(product, "putDeviceInThermalSimulationMode:")) {
      log("product does not respond to putDeviceInThermalSimulationMode: - API removed?");
      return false;
    }

    const modeStr = cfstr(THERMAL_MODE);
    if (!isNonZero(modeStr)) {
      log("CFStringCreateWithCString failed for '" + THERMAL_MODE + "'");
      return false;
    }
    log("calling -[CommonProduct putDeviceInThermalSimulationMode:'" + THERMAL_MODE + "']");
    objc(product, "putDeviceInThermalSimulationMode:", modeStr);
    log("thermal sim applied: " + THERMAL_MODE);
    return true;
  }

  try {
    log("=== powercuff_light.js loaded === requested level=" + THERMAL_MODE);
    Native.init();
    log("Native.init ok, baseAddr=0x" + new BigUint64Array(nativeCallBuff)[20].toString(16));

    // Sanity check we are inside thermalmonitord. CPMSHelper only exists here.
    const probe = Native.callSymbol("objc_getClass", "CPMSHelper");
    log("probe CPMSHelper=0x" + u64(probe).toString(16) + (probe ? " (thermalmonitord OK)" : " (WRONG PROCESS)"));

    const ok = applyThermal();
    log("powercuff_light result=" + ok + " level=" + THERMAL_MODE);
  } catch (e) {
    log("fatal: " + String(e) + " stack: " + (e.stack || "N/A"));
  }
})();
