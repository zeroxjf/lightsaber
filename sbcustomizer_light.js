(() => {
  function _sbcClamp(v, lo, hi, def) {
    var n = Number(v);
    if (!isFinite(n)) return def;
    n = Math.floor(n);
    if (n < lo) return lo;
    if (n > hi) return hi;
    return n;
  }
  // SBCustomizer config - read from the prelude baked in by pe_main.js at
  // inject time. Defaults match the historical sbcustomizer behavior so a
  // standalone payload run with no config prelude still does the right
  // thing (5 dock icons, 5 home cols, stock 6 rows).
  const DOCK_ICONS = _sbcClamp(globalThis.__sbc_dock_icons, 4, 7, 4);
  const HOMESCREEN_TARGET_COLS = _sbcClamp(globalThis.__sbc_hs_cols, 3, 7, 4);
  const HOMESCREEN_TARGET_ROWS = _sbcClamp(globalThis.__sbc_hs_rows, 4, 8, 6);
  const ENABLE_UNSAFE_IVAR_WRITES = false;
  const ENABLE_METHOD_ENUMERATION = false;
  const ENABLE_MODEL_GRID_SIZE_CHANGE = true;
  const ENABLE_LAYOUT_COLUMN_PATCH = true;
  const ENABLE_FORCE_RELAYOUT = false;
  const ENABLE_SECOND_PASS = false;
  // Repeat-loop interval for the statbar overlay. With the setText:-only
  // path (no setAlternateText: / setShowsAlternateText: / NSTimer state
  // machine), per-tick work is just a manager lookup + 16-view subview
  // walk + one setText: dispatch - ~5-10ms total, no state-machine
  // confusion, no watchdog risk. 2s ticks make the once-a-minute clock
  // overwrite barely visible: iOS's minute formatter writes _text, our
  // next tick restores within 2s. SBSpringBoard watchdog ceiling is
  // 60s; per-tick load is ~0.25%, well clear.
  const STATBAR_LOOP_INTERVAL_US = 2000000;
  // Hard ceiling on loop iterations so a bug can't spin the injected
  // worker forever. 12h at 2s = 21600 ticks. The loop also exits early
  // if globalThis.__sbcust_statbar_loop_active is cleared from another
  // context.
  const STATBAR_LOOP_MAX_ITERS = 21600;
  // Home screen grid patch uses the SBHIconManager -> listLayoutProvider
  // path verified against the 18.6.2 SpringBoardHome class dump
  // (-[SBHIconManager listLayoutProvider], -[SBHDefaultIconListLayoutProvider
  // layoutForIconLocation:], -[SBIconListGridLayoutConfiguration
  // setNumberOfPortraitColumns:] / setNumberOfPortraitRows:).
  const ENABLE_HOMESCREEN_COL_PATCH = true;
  // SBCustomizer features (dock icons / home grid / hide labels) only run
  // when the parent fiveicon tweak is enabled. StatBar is now its own
  // top-level tweak that reuses this same payload, so a user who enables
  // ONLY StatBar (without SBCustomizer) gets the overlay without any
  // dock/grid patches. __ls_enable_fiveicon is set by pe_main.js's
  // prelude (sbx1_main.js's prelude on the chain path) per lsTweakSet.
  // Default true if the global is undefined so the standalone-payload
  // case (no chain prelude) still works.
  const ENABLE_FIVEICON = (globalThis.__ls_enable_fiveicon !== false);
  // StatBar: snapshot overlay window showing battery temp + total RAM.
  // Ported from Coruna-Tweaks-Collection/StatBar/StatBar.m. Snapshot only
  // (no NSTimer) because block-based timers need a real ObjC block we
  // can't synthesize from JS, and -performSelector:...afterDelay: takes
  // a double which our int-only bridge can't pass.
  const ENABLE_STATBAR = (globalThis.__sbc_statbar === 1 || globalThis.__sbc_statbar === true);
  // BrokenBlade: snapshot-only. Every persistence variant we tried has
  // crashed SpringBoard one way or another, all rooted in the InjectJS
  // bridge being structurally hostile to two threads using it
  // concurrently:
  //
  //   - waitUntilDone:NO (a2bf2fb): worker writes to nativeCallBuff
  //     while main is also using it for its own bridge calls; X0..X7
  //     arg slots get scrambled, objc_msgSend lands on a wrong
  //     receiver/selector pair, doesNotRecognizeSelector raises out of
  //     __invoking___ and SpringBoard SIGABRTs (141546.ips).
  //   - waitUntilDone:YES (1ab2d20): worker parks in pthread_cond_wait
  //     INSIDE the hijacked oinv/jsinv/inv NSInvocation chain. Main
  //     wants to use the same NSInvocation chain to run the dispatched
  //     script, walks into its partially-committed state, and hangs.
  //     Watchdog kills SpringBoard for 60s+ main-thread silence
  //     (145412.ips).
  //
  // Both are NSInvocation- / shared-buffer-not-thread-safe issues at the
  // bridge layer. Fixing them properly means giving the bridge a per-
  // thread NSInvocation chain, which is a pe_main.js / InjectJS change
  // outside this StatBar feature's scope.
  //
  // Snapshot-only sidesteps the issue: a single combined dispatch (one
  // bridge call) runs apply_once + statbar in one main-thread script,
  // worker exits, no further bridge contention, no race. StatBar shows
  // briefly (until the next system status-bar refresh / minute tick
  // / layout pass) and then reverts. Tradeoff vs reliability: chain
  // stays alive, no SpringBoard crashes.
  const ENABLE_STATBAR_REPEAT_LOOP = false;
  // BrokenBlade: the 18.5 crash (SpringBoard-2026-05-02-020440.ips) hit
  // PAC_EXCEPTION on objc_msgSend "count" with X0 = 0x9FE03000 - a value
  // way below the iOS arm64e ObjC heap (which always lives above 4 GB).
  // The walk handed a sub-4GB scalar to objc_msgSend as a receiver. Now
  // every receiver in the walk goes through isObjcReceiver(), which
  // refuses to dispatch on anything below 0x100000000. The crash converts
  // into a clean "not a plausible ObjC pointer" log and bail, instead of
  // killing SpringBoard, and the success path is still intact for the
  // common case where the bridge returns real heap pointers.
  const ENABLE_STATBAR_DISPATCH = true;
  // Hide icon labels - calls -[SBIconListGridLayoutConfiguration setShowsLabels:NO]
  // on the same cfg object we already get in patchHomescreenGrid. BOOL arg,
  // no FP regs, no new class lookups. Verified against 18.6.2 SpringBoardHome
  // dump (line 27063: -[SBIconListGridLayoutConfiguration setShowsLabels:]).
  const ENABLE_HIDE_LABELS = (globalThis.__sbc_hide_labels === 1 || globalThis.__sbc_hide_labels === true);
  // Speedster (in development / unstable): ports a small subset of
  // Hoangdus/Speedster (GPLv3) using the FBSettings domain hierarchy
  // instead of the substrate-style IMP hooks Speedster uses on
  // jailbroken iOS. We reach the live settings instances iOS itself
  // reads, then write the sub-setting BOOL/double ivars directly via
  // the bridge. No swizzle, no kernel R/W. Two features in v1:
  //   - jitter:   [[SBHHomeScreenDomain rootSettings] iconSettings]
  //               setSuppressJitter:YES   (kills home-screen jiggle in
  //               edit mode; iOS already ships the toggle, just no UI)
  //   - fastWake: [[SBSystemAnimationDomain rootSettings] wakeAnimationSettings]
  //               setSpeedMultiplierForWake:3.0 +
  //               setSpeedMultiplierForLiftToWake:3.0 +
  //               setBacklightFadeDuration:0.05  (3x faster screen wake;
  //               needs FP bridge for the doubles)
  // Marked unstable because it's a one-shot apply: if iOS rebuilds the
  // rootSettings (e.g. respring, scene swap) the override is lost
  // until the chain is re-run. Persistence via tick-loop reapply is a
  // future iteration.
  const ENABLE_SPEEDSTER = (globalThis.__ls_enable_speedster === 1 || globalThis.__ls_enable_speedster === true);
  const SPEEDSTER_SUPPRESS_JITTER = (globalThis.__sbc_speedster_jitter === 1 || globalThis.__sbc_speedster_jitter === true);
  const SPEEDSTER_FAST_WAKE = (globalThis.__sbc_speedster_wake === 1 || globalThis.__sbc_speedster_wake === true);
  const SPEEDSTER_WAKE_MULTIPLIER = 3.0;
  const SPEEDSTER_BACKLIGHT_FADE_SEC = 0.05;
  // Grid reapply loop. Disabled by default after v0.0.83 shipped a version
  // that hung the device: the drift-detect-and-repatch approach works in
  // theory, but in practice after patchHomescreenGrid + forceRelayout the
  // provider re-generates cfg.numberOfPortraitColumns from its device-class
  // defaults before the next poll, so every tick sees drift -> re-patches
  // -> forces relayout -> animation churn 1.5s apart -> main-thread
  // starvation -> input freezes. Left in place (gated off) for future
  // investigation once we understand why the cfg ivar reverts between ticks.
  const ENABLE_GRID_REAPPLY_LOOP = false;
  const GRID_REAPPLY_INTERVAL_US = 1500000; // kept for future re-enable
  const GRID_REAPPLY_MAX_ITERS = 28800;     // kept for future re-enable

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

    static read32(ptr) {
      const dv = new DataView(this.read(ptr, 4));
      return dv.getUint32(0, true);
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

    // FP-register variant: also writes d0..d7 (lower 8 bytes of q0..q7).
    //
    // Bridge layout (verified against -[NSInvocation invokeUsingIMP:] ->
    // ___invoking___ at CoreFoundation 0x182bb98a0): the inner __invoking___
    // loads q0..q7 from offsets 0x50, 0x60, 0x70, 0x80, 0x90, 0xa0, 0xb0,
    // 0xc0 within argsBuff. argsBuff is at callBuff+0x320 = nativeCallBuff
    // byte offset 0x320, so q0 sits at byte 0x320+0x50=0x370 = Float64Array
    // index 110 (0x370/8). q1..q7 stride by 0x10 bytes (16 bytes per quad)
    // = 2 Float64 indices each. Lower 8 bytes of each quad is d0..d7 for
    // scalar double args (CGFloat); upper 8 bytes are unused for scalar
    // doubles (would matter for vector / SIMD args).
    //
    // Stale values in the FP slots between bridge calls would read as
    // d0..d7 garbage for any callee that takes FP args, so we explicitly
    // zero unset slots each call.
    static #nativeCallAddrFP(addr, xArgs, fpArgs) {
      const intBuff = new BigInt64Array(nativeCallBuff);
      const fpBuff = new Float64Array(nativeCallBuff);
      intBuff[0] = addr;
      for (let i = 0; i < 8; i++) {
        intBuff[100 + i] = (i < xArgs.length) ? xArgs[i] : 0n;
      }
      // d0..d7 sit at Float64 indices 110, 112, 114, 116, 118, 120, 122, 124.
      for (let i = 0; i < 8; i++) {
        fpBuff[110 + i * 2] = (i < fpArgs.length) ? Number(fpArgs[i]) : 0;
      }
      invoker();
      return intBuff[200];
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

    // FP-register variant of callSymbol. xArgs is an array (up to 8 entries
    // for x0..x7); fpArgs is an array of up to 8 doubles for d0..d7.
    // Use this for ObjC methods that take CGRect / CGPoint / CGFloat
    // by-value args (setFrame:, setWindowLevel:, setAlpha:, etc.) which
    // route through d0..d7 in the arm64 ABI for HFA / scalar floats and
    // would otherwise be unreachable from the x-only #nativeCallAddr path.
    //
    // Returns the integer (x0) return value, same convention as callSymbol.
    // For double / CGFloat / CGRect return values, call fpReturn(slot)
    // immediately after this returns - it reads d0..d3 from the result
    // buffer that __invoking___ writes back.
    static callSymbolFP(name, xArgs, fpArgs) {
      this.#argPtr = this.#argMem;
      const xConverted = new Array(8);
      for (let i = 0; i < 8; i++) {
        xConverted[i] = (xArgs && i < xArgs.length) ? this.#toNative(xArgs[i]) : 0n;
      }
      const funcAddr = this.#dlsym(name);
      const ret64 = this.#nativeCallAddrFP(funcAddr, xConverted, fpArgs || []);
      this.#argPtr = this.#argMem;
      if (ret64 < 0xffffffffn && ret64 > -0xffffffffn) return Number(ret64);
      return ret64;
    }

    // Read a double-return from the most recent FP call. Slot 0..3 maps
    // to d0..d3 (which is enough for CGRect-as-HFA returns). __invoking___
    // writes back q0..q7 to resultBuff (callBuff+0x640) at offsets 0x50,
    // 0x60, ..., so d0 = Float64 index 210 (= byte 0x690). Stride 2 per
    // slot (16 bytes per quad).
    static fpReturn(slot) {
      if (slot < 0 || slot > 7) return 0;
      const fpBuff = new Float64Array(nativeCallBuff);
      return fpBuff[210 + slot * 2];
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

  // BrokenBlade: pre-dispatch sanity check for any value we're about to
  // hand to objc_msgSend as a receiver. iOS arm64e ObjC heap allocations
  // always live above 4 GB - the malloc nano/scalable allocators map them
  // into the 0x100000000+ space, and runtime classes/imps live at
  // 0x180000000+. Anything below 4 GB is either a BOOL/int return that
  // leaked into a receiver slot, an unmapped value in callBuff[200] that
  // the bridge didn't cleanly write, or an ObjC pointer that's been
  // truncated. The 18.5 SpringBoard PAC crash on -count
  // (SpringBoard-2026-05-02-020440.ips) had X0 = 0x9FE03000, exactly the
  // shape this guard rejects. Faster than -respondsToSelector: and safe
  // even when the would-be receiver is unmapped, since we never
  // dereference it.
  function isObjcReceiver(v) {
    return u64(v) >= 0x100000000n;
  }

  // BrokenBlade: every objc_msgSend call from injected JS goes through
  // JSC's ObjCCallbackFunction -> NSInvocation chain, and JSC wraps each
  // invoker() round-trip in its own @autoreleasepool {}. So any return
  // value that's *only* held by autorelease balance is already dead by
  // the time JS reads nativeCallBuff[200] back. Returns held by some
  // other strong reference (singletons, strong ivars on parent objects,
  // _subviewCache, etc.) survive the drain because the underlying object
  // never actually deallocates - only the +1 autorelease balance is
  // paid. The crash distinguisher is whether ANYONE ELSE retains the
  // return:
  //   - +sharedApplication, -keyWindow, -windowScene, -statusBar,
  //     -statusBarManager, -subviews (returns _subviewCache strong ivar):
  //     SAFE, object owned elsewhere
  //   - -[UIWindowScene windows] (fresh _allWindowsIncludingInternalWindows:
  //     filtered NSArray, no other owner): UNSAFE, dies immediately
  //   - +[NSString stringWithUTF8String:] (fresh autoreleased NSString):
  //     UNSAFE if reused across bridge calls
  // For UNSAFE cases we either route around them (use a strongly-owned
  // accessor like SBWindowSceneStatusBarManager) or use the
  // alloc/initWith... pattern which returns +1 retained outside the
  // autorelease chain.

  // +1 retained NSString that survives JSC's pool drain. Leaks +1 - fine
  // for one-shot setText: snapshot.
  function nsStrRetained(str) {
    const NSString = Native.callSymbol("objc_getClass", "NSString");
    if (!isObjcReceiver(NSString)) return 0n;
    const allocated = Native.callSymbol("objc_msgSend", NSString, sel("alloc"));
    if (!isObjcReceiver(allocated)) return 0n;
    return Native.callSymbol("objc_msgSend", allocated, sel("initWithUTF8String:"), str);
  }

  function log(msg) {
    try {
      const tagged = "[SBC] " + msg;
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

  function tryObjSelector(obj, selectorNames) {
    for (const selectorName of selectorNames) {
      if (!canRespond(obj, selectorName)) continue;
      const out = objc(obj, selectorName);
      if (isNonZero(out)) return out;
    }
    return 0n;
  }

  function writeU32(ptr, value) {
    const buff = new ArrayBuffer(4);
    const dv = new DataView(buff);
    dv.setUint32(0, value >>> 0, true);
    Native.write(ptr, buff);
  }

  function writeU64(ptr, value) {
    const buff = new ArrayBuffer(8);
    const dv = new DataView(buff);
    dv.setBigUint64(0, u64(value), true);
    Native.write(ptr, buff);
  }

  function patchIvarU32(obj, ivarName, value) {
    const cls = Native.callSymbol("object_getClass", obj);
    if (!isNonZero(cls)) return false;
    const ivar = Native.callSymbol("class_getInstanceVariable", cls, ivarName);
    if (!isNonZero(ivar)) return false;
    const offset = Number(Native.callSymbol("ivar_getOffset", ivar));
    const ptr = u64(obj) + BigInt(offset);
    const before = Native.read32(ptr);
    writeU32(ptr, value);
    const after = Native.read32(ptr);
    log("ivar " + ivarName + " (u32) 0x" + before.toString(16) + " -> 0x" + after.toString(16));
    return true;
  }

  function patchGridSize(model) {
    const cls = Native.callSymbol("object_getClass", model);
    if (!isNonZero(cls)) return false;
    const ivar = Native.callSymbol("class_getInstanceVariable", cls, "_gridSize");
    if (!isNonZero(ivar)) return false;
    const offset = Number(Native.callSymbol("ivar_getOffset", ivar));
    const ptr = u64(model) + BigInt(offset);
    const oldVal = Native.read32(ptr) >>> 0;
    const low = oldVal & 0xffff;
    const high = (oldVal >>> 16) & 0xffff;

    let newVal = oldVal;
    if (low === 4 || low === DOCK_ICONS) {
      newVal = (oldVal & 0xffff0000) | DOCK_ICONS;
    } else if (high === 4 || high === DOCK_ICONS) {
      newVal = (DOCK_ICONS << 16) | (oldVal & 0xffff);
    } else {
      // Default to the common packing {rows:high16, cols:low16}.
      newVal = (oldVal & 0xffff0000) | DOCK_ICONS;
    }

    writeU32(ptr, newVal >>> 0);
    const after = Native.read32(ptr) >>> 0;
    log("_gridSize 0x" + oldVal.toString(16) + " -> 0x" + after.toString(16));
    return true;
  }

  function patchIvarU64(obj, ivarName, value) {
    const cls = Native.callSymbol("object_getClass", obj);
    if (!isNonZero(cls)) return false;
    const ivar = Native.callSymbol("class_getInstanceVariable", cls, ivarName);
    if (!isNonZero(ivar)) return false;
    const offset = Number(Native.callSymbol("ivar_getOffset", ivar));
    const ptr = u64(obj) + BigInt(offset);
    const before = Native.readPtr(ptr);
    writeU64(ptr, value);
    const after = Native.readPtr(ptr);
    log("ivar " + ivarName + " (u64) " + before.toString() + " -> " + after.toString());
    return true;
  }

  function trySetU64(obj, setterName, value) {
    if (!isNonZero(obj)) return false;
    if (!canRespond(obj, setterName)) return false;
    objc(obj, setterName, BigInt(value));
    log("setter " + setterName + " <- " + value);
    return true;
  }

  function logGetterU64(obj, getterName, tag) {
    if (!isNonZero(obj)) return;
    if (!canRespond(obj, getterName)) return;
    const v = objc(obj, getterName);
    log(tag + "." + getterName + "=" + u64(v).toString());
  }

  function dumpMethodsForKeywords(obj, tag, keywords) {
    if (!ENABLE_METHOD_ENUMERATION) return;
    if (!isNonZero(obj)) return;
    const cls = Native.callSymbol("object_getClass", obj);
    if (!isNonZero(cls)) return;

    const countPtr = Native.callSymbol("malloc", 4n);
    writeU32(countPtr, 0);
    const list = Native.callSymbol("class_copyMethodList", cls, countPtr);
    const count = Native.read32(countPtr) >>> 0;
    Native.callSymbol("free", countPtr);
    if (!isNonZero(list) || count === 0) return;

    try {
      for (let i = 0; i < count; i++) {
        const method = Native.readPtr(u64(list) + BigInt(i * 8));
        if (!isNonZero(method)) continue;
        const nameSel = Native.callSymbol("method_getName", method);
        if (!isNonZero(nameSel)) continue;
        const namePtr = Native.callSymbol("sel_getName", nameSel);
        if (!isNonZero(namePtr)) continue;
        const name = Native.readString(namePtr, 256);
        const lower = name.toLowerCase();
        let keep = false;
        for (const kw of keywords) {
          if (lower.indexOf(kw) >= 0) {
            keep = true;
            break;
          }
        }
        if (keep) log(tag + ".method " + name);
      }
    } catch (e) {
      log(tag + ".method-dump err: " + String(e));
    }

    Native.callSymbol("free", list);
  }

  function patchModelGridSize(model) {
    if (!isNonZero(model)) return false;
    if (!canRespond(model, "gridSize")) return false;

    const oldGrid = u64(objc(model, "gridSize")) & 0xffffffffn;
    const oldCols = Number(oldGrid & 0xffffn);
    const oldRows = Number((oldGrid >> 16n) & 0xffffn);
    const newGrid = ((oldGrid & 0xffff0000n) | BigInt(DOCK_ICONS)) & 0xffffffffn;

    if (canRespond(model, "setGridSize:")) {
      objc(model, "setGridSize:", newGrid);
    } else if (canRespond(model, "changeGridSize:options:")) {
      objc(model, "changeGridSize:options:", newGrid, 0n);
    } else {
      return false;
    }

    const afterGrid = canRespond(model, "gridSize") ? (u64(objc(model, "gridSize")) & 0xffffffffn) : 0n;
    const afterCols = Number(afterGrid & 0xffffn);
    const afterRows = Number((afterGrid >> 16n) & 0xffffn);
    log(
      "gridSize cols/rows " +
      oldCols + "/" + oldRows + " -> " +
      afterCols + "/" + afterRows +
      " (0x" + oldGrid.toString(16) + " -> 0x" + afterGrid.toString(16) + ")"
    );
    return true;
  }

  function patchLayoutColumns(dockListView) {
    if (!isNonZero(dockListView)) return false;
    const layout = tryObjSelector(dockListView, ["layout"]);
    if (!isNonZero(layout)) return false;
    const cfg = tryObjSelector(layout, ["layoutConfiguration"]);
    if (!isNonZero(cfg)) return false;

    if (!canRespond(cfg, "numberOfPortraitRows")) return false;
    if (!canRespond(cfg, "numberOfPortraitColumns")) return false;
    if (!canRespond(cfg, "setNumberOfPortraitColumns:")) return false;

    const rows = u64(objc(cfg, "numberOfPortraitRows"));
    const beforeCols = u64(objc(cfg, "numberOfPortraitColumns"));
    if (rows !== 1n) {
      log("cfg.portraitRows=" + rows.toString() + " (skip non-dock layout)");
      return false;
    }

    objc(cfg, "setNumberOfPortraitColumns:", BigInt(DOCK_ICONS));
    const afterCols = u64(objc(cfg, "numberOfPortraitColumns"));
    log("cfg.portraitRows=" + rows.toString() + " portraitColumns " + beforeCols.toString() + " -> " + afterCols.toString());

    if (canRespond(cfg, "numberOfLandscapeColumns")) {
      log("cfg.landscapeColumns=" + u64(objc(cfg, "numberOfLandscapeColumns")).toString());
    }

    if (canRespond(dockListView, "layoutOrientation") && canRespond(layout, "numberOfColumnsForOrientation:")) {
      const orient = u64(objc(dockListView, "layoutOrientation"));
      const cols = u64(objc(layout, "numberOfColumnsForOrientation:", orient));
      log("layout.columnsForOrientation(" + orient.toString() + ")=" + cols.toString());
    }

    return afterCols === BigInt(DOCK_ICONS);
  }

  function runOnMainEvaluate(script) {
    const jsctxObj = globalThis.__sbcust_jsctx_obj;
    log("runOnMainEvaluate: jsctxObj=0x" + u64(jsctxObj).toString(16) + " scriptLen=" + script.length);
    if (!isNonZero(jsctxObj)) {
      log("runOnMainEvaluate: jsctxObj is NULL, aborting");
      return false;
    }
    const s = cfstr(script);
    log("runOnMainEvaluate: cfstr=0x" + u64(s).toString(16) + " calling performSelectorOnMainThread (waitUntilDone:NO)");
    // waitUntilDone:NO. YES (tried in 1ab2d20) blocks the worker thread
    // INSIDE the hijacked oinv/jsinv/inv NSInvocation chain; main then
    // tries to use the same NSInvocation chain to run the dispatched
    // script and hangs on its partially-committed state, leading to
    // SpringBoard watchdog kill (145412.ips).
    // NO is racy with concurrent bridge use, so it's the caller's
    // responsibility not to make any further bridge calls between the
    // dispatch and the worker thread exiting / sleeping. The combined-
    // dispatch + immediate-exit pattern further down avoids the race
    // entirely; the loop variants did not, hence ENABLE_STATBAR_REPEAT_LOOP
    // = false.
    objc(jsctxObj, "performSelectorOnMainThread:withObject:waitUntilDone:", sel("evaluateScript:"), s, 0);
    log("runOnMainEvaluate: performSelector returned, skipping CFRelease (main thread owns cfstr now)");
    // NOTE: Do NOT CFRelease the cfstr here. Main thread retains/releases
    // via performSelector's autorelease pool. Releasing on the injected
    // thread races the release path's objc_msgSend on a main-thread-signed
    // isa.
    return true;
  }

  function patchHomescreenGrid(iconCtrl, targetCols, targetRows) {
    if (!isNonZero(iconCtrl)) { log("patchHomescreenGrid: nil iconCtrl"); return 0; }
    log("patchHomescreenGrid: entry, target=" + targetCols + "x" + targetRows);

    if (!canRespond(iconCtrl, "iconManager")) {
      log("patchHomescreenGrid: iconCtrl has no iconManager");
      return 0;
    }
    const iconMgr = objc(iconCtrl, "iconManager");
    log("patchHomescreenGrid: iconMgr=0x" + u64(iconMgr).toString(16));
    if (!isNonZero(iconMgr)) { log("patchHomescreenGrid: nil iconMgr"); return 0; }

    if (!canRespond(iconMgr, "listLayoutProvider")) {
      log("patchHomescreenGrid: iconMgr has no listLayoutProvider");
      return 0;
    }
    const provider = objc(iconMgr, "listLayoutProvider");
    log("patchHomescreenGrid: provider=0x" + u64(provider).toString(16));
    if (!isNonZero(provider)) { log("patchHomescreenGrid: nil provider"); return 0; }

    if (!canRespond(provider, "layoutForIconLocation:")) {
      log("patchHomescreenGrid: provider has no layoutForIconLocation:");
      return 0;
    }

    const loc = cfstr("SBIconLocationRoot");
    log("patchHomescreenGrid: loc=0x" + u64(loc).toString(16));
    if (!isNonZero(loc)) { log("patchHomescreenGrid: cfstr failed"); return 0; }

    const layout = objc(provider, "layoutForIconLocation:", loc);
    log("patchHomescreenGrid: layout=0x" + u64(layout).toString(16));
    if (!isNonZero(layout)) { log("patchHomescreenGrid: nil layout for root"); return 0; }

    if (!canRespond(layout, "layoutConfiguration")) {
      log("patchHomescreenGrid: layout has no layoutConfiguration");
      return 0;
    }
    const cfg = objc(layout, "layoutConfiguration");
    log("patchHomescreenGrid: cfg=0x" + u64(cfg).toString(16));
    if (!isNonZero(cfg)) { log("patchHomescreenGrid: nil cfg"); return 0; }

    if (!canRespond(cfg, "setNumberOfPortraitColumns:")) {
      log("patchHomescreenGrid: cfg has no setNumberOfPortraitColumns:");
      return 0;
    }

    const beforeCols = canRespond(cfg, "numberOfPortraitColumns") ? u64(objc(cfg, "numberOfPortraitColumns")) : 0n;
    const beforeRows = canRespond(cfg, "numberOfPortraitRows") ? u64(objc(cfg, "numberOfPortraitRows")) : 0n;
    log("patchHomescreenGrid: before cols=" + beforeCols.toString() + " rows=" + beforeRows.toString());

    objc(cfg, "setNumberOfPortraitColumns:", BigInt(targetCols));
    if (canRespond(cfg, "setNumberOfPortraitRows:")) {
      objc(cfg, "setNumberOfPortraitRows:", BigInt(targetRows));
    }
    // Rotate: landscape columns = portrait rows, landscape rows = portrait columns.
    if (canRespond(cfg, "setNumberOfLandscapeColumns:")) {
      objc(cfg, "setNumberOfLandscapeColumns:", BigInt(targetRows));
    }
    if (canRespond(cfg, "setNumberOfLandscapeRows:")) {
      objc(cfg, "setNumberOfLandscapeRows:", BigInt(targetCols));
    }

    // Hide icon labels if requested. setShowsLabels: is a BOOL setter on
    // the same cfg object we just modified, so we get it for free on this
    // code path. Verified via SpringBoardHome dump line 27063. The
    // subsequent stabilizeRootListViews / forceRelayout pass picks this up
    // along with the column count change.
    if (ENABLE_HIDE_LABELS && canRespond(cfg, "setShowsLabels:")) {
      const beforeLabels = canRespond(cfg, "showsLabels") ? u64(objc(cfg, "showsLabels")) : 0n;
      objc(cfg, "setShowsLabels:", 0n);
      const afterLabels = canRespond(cfg, "showsLabels") ? u64(objc(cfg, "showsLabels")) : 0n;
      log("patchHomescreenGrid: showsLabels " + beforeLabels.toString() + " -> " + afterLabels.toString());
    }

    const afterCols = canRespond(cfg, "numberOfPortraitColumns") ? u64(objc(cfg, "numberOfPortraitColumns")) : 0n;
    const afterRows = canRespond(cfg, "numberOfPortraitRows") ? u64(objc(cfg, "numberOfPortraitRows")) : 0n;
    log("patchHomescreenGrid: after cols=" + afterCols.toString() + " rows=" + afterRows.toString() + " (target=" + targetCols + "x" + targetRows + ")");
    return (afterCols === BigInt(targetCols) && afterRows === BigInt(targetRows)) ? 1 : 0;
  }

  // Stabilize root list view metrics after patching the provider's grid.
  //
  // v1 of this walked rootFolderController.iconListViews (NSArray) and
  // PAC-faulted on the respondsToSelector: call against the returned
  // array on 18.6.2 - the @property is declared with `,C` copy semantics,
  // so the getter hands back a fresh autoreleased copy each time, and
  // calling objc_msgSend on that copy tripped the method cache PAC check.
  //
  // v2 (previous) only touched -currentIconListView to avoid the array,
  // which left off-screen pages + the dock with auto-fit still ON. When
  // an icon dragged from a home page into the dock, the drag teardown
  // path re-read metrics on views that had never been stabilized and
  // the column count popped back to stock iOS defaults mid-animation.
  //
  // v3 (this version) iterates via the index-based accessors on
  // SBFolderController (iconListViewCount + iconListViewAtIndex:,
  // verified against sbhome.log lines 7166 and 7264), which skip the
  // copy-property path entirely, and also touches iconMgr.dockListView.
  // That hits EVERY existing list view (current page, off-screen pages,
  // and the dock) with setAutomaticallyAdjustsLayoutMetricsToFit:NO so
  // none of them auto-resize away from our patched column count when
  // the user drags icons between the home grid and the dock.
  //
  // A single -[SBFolderController layoutIconListsWithAnimationType:
  // forceRelayout:] at the end flushes the whole thing through in one
  // animation step.
  function stabilizeRootListViews(iconCtrl) {
    log("stabilizeRootListViews: entry");
    if (!canRespond(iconCtrl, "iconManager")) {
      log("stabilizeRootListViews: no iconManager");
      return 0;
    }
    const iconMgr = objc(iconCtrl, "iconManager");
    if (!isNonZero(iconMgr)) { log("stabilizeRootListViews: nil iconMgr"); return 0; }

    if (!canRespond(iconMgr, "rootFolderController")) {
      log("stabilizeRootListViews: no rootFolderController selector");
      return 0;
    }
    const rootFolder = objc(iconMgr, "rootFolderController");
    log("stabilizeRootListViews: rootFolder=0x" + u64(rootFolder).toString(16));
    if (!isNonZero(rootFolder)) { log("stabilizeRootListViews: nil rootFolder"); return 0; }

    let touched = 0;

    // Helper: disable auto-fit on a single list view. Safe to call on any
    // pointer that responds to setAutomaticallyAdjustsLayoutMetricsToFit:.
    function disableAutoFit(lv, tag) {
      if (!isNonZero(lv)) return false;
      if (!canRespond(lv, "setAutomaticallyAdjustsLayoutMetricsToFit:")) {
        log("stabilizeRootListViews: " + tag + " has no setAutoFit:");
        return false;
      }
      const before = canRespond(lv, "automaticallyAdjustsLayoutMetricsToFit") ? u64(objc(lv, "automaticallyAdjustsLayoutMetricsToFit")) : 0n;
      objc(lv, "setAutomaticallyAdjustsLayoutMetricsToFit:", 0n);
      const after = canRespond(lv, "automaticallyAdjustsLayoutMetricsToFit") ? u64(objc(lv, "automaticallyAdjustsLayoutMetricsToFit")) : 0n;
      log("stabilizeRootListViews: " + tag + " autoFit " + before.toString() + " -> " + after.toString());
      return true;
    }

    // Also disable the icon list view's adjusts-when-reordering path if it
    // exists - that's the flag the drag-drop teardown reads during the
    // icon-move-to-dock animation. Present on modern SBIconListView; absent
    // on older builds (canRespond gates both cases).
    function disableAutoFitAndFriends(lv, tag) {
      if (!disableAutoFit(lv, tag)) return false;
      return true;
    }

    // Current page - keep the existing fast path as a sanity check.
    if (canRespond(rootFolder, "currentIconListView")) {
      const curLv = objc(rootFolder, "currentIconListView");
      log("stabilizeRootListViews: currentIconListView=0x" + u64(curLv).toString(16));
      if (disableAutoFitAndFriends(curLv, "currentIconListView")) touched++;
    }

    // All pages via index accessors. iconListViewCount returns unsigned
    // long; iconListViewAtIndex: takes unsigned long and returns a
    // retained-autoreleased SBIconListView*. Neither goes through the
    // copy-property path that PAC-faulted v1, because they hand back
    // the internal ivar directly.
    if (canRespond(rootFolder, "iconListViewCount") && canRespond(rootFolder, "iconListViewAtIndex:")) {
      const cntRaw = objc(rootFolder, "iconListViewCount");
      const cnt = Number(u64(cntRaw));
      log("stabilizeRootListViews: iconListViewCount=" + cnt);
      // Safety cap: iOS doesn't realistically have more than ~30 home
      // pages, and a runaway count here would flood syslog, so bail out
      // past a sane ceiling rather than iterating to 0xffffffff if the
      // selector misbehaves.
      const lim = cnt < 64 ? cnt : 64;
      for (let i = 0; i < lim; i++) {
        const lv = objc(rootFolder, "iconListViewAtIndex:", BigInt(i));
        if (!isNonZero(lv)) continue;
        if (disableAutoFitAndFriends(lv, "list[" + i + "]")) touched++;
      }
    } else {
      log("stabilizeRootListViews: no iconListViewCount/atIndex: path - pages past current will be unstable");
    }

    // Dock list view - this is the piece the previous version missed.
    // When an icon is dragged from a home page INTO the dock, the dock's
    // list view has its own auto-fit flag and its own layout config, and
    // without this it springs back to the stock 4-column look during
    // the drop animation.
    if (canRespond(iconMgr, "dockListView")) {
      const dockLv = objc(iconMgr, "dockListView");
      log("stabilizeRootListViews: dockListView=0x" + u64(dockLv).toString(16));
      if (disableAutoFitAndFriends(dockLv, "dockListView")) touched++;
    }

    // Force a uniform relayout pass so every list view we just stabilized
    // rebuilds from the patched provider config in one consistent step.
    // This is what Atria's updateLayoutForRoot:forDock:animated: ends up
    // calling.
    if (canRespond(rootFolder, "layoutIconListsWithAnimationType:forceRelayout:")) {
      log("stabilizeRootListViews: calling layoutIconListsWithAnimationType:0 forceRelayout:YES");
      objc(rootFolder, "layoutIconListsWithAnimationType:forceRelayout:", 0n, 1n);
      log("stabilizeRootListViews: forced relayout returned");
    } else {
      log("stabilizeRootListViews: no layoutIconListsWithAnimationType:forceRelayout: selector");
    }
    log("stabilizeRootListViews: touched=" + touched);
    return touched > 0 ? 1 : 0;
  }

  // Cached CFString for the polled reapply path. Hitting cfstr() every tick
  // would leak one CFString per poll (CFStringCreateWithCString returns +1).
  // Allocate once and reuse forever - the static interned constant in the
  // SpringBoardHome dylib (found at 0x1d80a4f40 via ipsw dyld str on 18.6.2)
  // is value-equal to ours via -isEqualToString:, so the provider lookup
  // still hits the same layout regardless of pointer identity.
  function getCachedIconLocationRootCFString() {
    let cached = globalThis.__sbcust_cfstr_iconRoot;
    if (isNonZero(cached)) return cached;
    cached = cfstr("SBIconLocationRoot");
    if (isNonZero(cached)) {
      globalThis.__sbcust_cfstr_iconRoot = cached;
    }
    return cached;
  }

  // Cheap drift detector + re-applier for the home screen grid. Designed to
  // run on the main thread from the polled reapply loop. The stable path is
  // 8 ObjC reads and zero writes (so it's safe to run every 1.5s without
  // animation churn). The drift path calls the full patchHomescreenGrid +
  // stabilizeRootListViews treatment, which triggers a forced relayout -
  // acceptable because it only happens when the layout ACTUALLY diverged
  // from our target (typically right after a drag-to-dock event).
  function reapplyGridIfDrifted(iconCtrl) {
    if (!isNonZero(iconCtrl)) return false;
    if (!canRespond(iconCtrl, "iconManager")) return false;
    const iconMgr = objc(iconCtrl, "iconManager");
    if (!isNonZero(iconMgr)) return false;
    if (!canRespond(iconMgr, "listLayoutProvider")) return false;
    const provider = objc(iconMgr, "listLayoutProvider");
    if (!isNonZero(provider)) return false;
    if (!canRespond(provider, "layoutForIconLocation:")) return false;
    const loc = getCachedIconLocationRootCFString();
    if (!isNonZero(loc)) return false;
    const layout = objc(provider, "layoutForIconLocation:", loc);
    if (!isNonZero(layout)) return false;
    if (!canRespond(layout, "layoutConfiguration")) return false;
    const cfg = objc(layout, "layoutConfiguration");
    if (!isNonZero(cfg)) return false;
    if (!canRespond(cfg, "numberOfPortraitColumns") || !canRespond(cfg, "numberOfPortraitRows")) {
      return false;
    }
    const curCols = u64(objc(cfg, "numberOfPortraitColumns"));
    const curRows = u64(objc(cfg, "numberOfPortraitRows"));
    const targetCols = BigInt(HOMESCREEN_TARGET_COLS);
    const targetRows = BigInt(HOMESCREEN_TARGET_ROWS);
    if (curCols === targetCols && curRows === targetRows) {
      // Stable - nothing to do. Intentionally no log here so the syslog
      // doesn't get one line per tick forever.
      return false;
    }
    log("reapplyGridIfDrifted: drift detected cur=" + curCols.toString() + "x" + curRows.toString() + " target=" + HOMESCREEN_TARGET_COLS + "x" + HOMESCREEN_TARGET_ROWS);
    try {
      patchHomescreenGrid(iconCtrl, HOMESCREEN_TARGET_COLS, HOMESCREEN_TARGET_ROWS);
    } catch (hsErr) {
      log("reapplyGridIfDrifted: patchHomescreenGrid threw: " + String(hsErr));
    }
    try {
      stabilizeRootListViews(iconCtrl);
    } catch (stabErr) {
      log("reapplyGridIfDrifted: stabilizeRootListViews threw: " + String(stabErr));
    }
    return true;
  }

  function forceRelayout(dockListView) {
    const selectors = ["layoutIconsNow", "setNeedsLayout", "layoutIfNeeded"];
    for (const selectorName of selectors) {
      if (canRespond(dockListView, selectorName)) objc(dockListView, selectorName);
    }
    const superview = tryObjSelector(dockListView, ["superview"]);
    if (isNonZero(superview)) {
      if (canRespond(superview, "setNeedsLayout")) objc(superview, "setNeedsLayout");
      if (canRespond(superview, "layoutIfNeeded")) objc(superview, "layoutIfNeeded");
    }
  }

  // ---- StatBar port ----------------------------------------------------
  //
  // Bridge constraint: #nativeCallAddr only loads x0..x7; no FP regs. That
  // kills any direct call taking CGRect/CGFloat (initWithFrame:, setFrame:,
  // setWindowLevel:, systemFontOfSize:, colorWithWhite:alpha:, etc.). We
  // route those through KVC: setValue:forKey: unboxes NSValue<CGRect> into
  // the frame setter and NSNumber into the windowLevel setter internally,
  // and both code paths take object pointers only.

  function nsValueFromCGRect(x, y, w, h) {
    const mem = Native.callSymbol("malloc", 32n);
    const buf = new ArrayBuffer(32);
    const dv = new DataView(buf);
    dv.setFloat64(0, x, true);
    dv.setFloat64(8, y, true);
    dv.setFloat64(16, w, true);
    dv.setFloat64(24, h, true);
    Native.write(mem, buf);
    const typeEnc = Native.callSymbol("malloc", 64n);
    Native.writeString(typeEnc, "{CGRect={CGPoint=dd}{CGSize=dd}}");
    const NSValue = Native.callSymbol("objc_getClass", "NSValue");
    const v = objc(NSValue, "valueWithBytes:objCType:", mem, typeEnc);
    Native.callSymbol("free", mem);
    Native.callSymbol("free", typeEnc);
    return v;
  }

  // Call an ObjC method that takes a by-value struct argument (CGRect,
  // CGPoint, CGFloat, etc.) by packing the raw bytes into an NSInvocation
  // and invoking it. Avoids NSValue unboxing entirely (-[NSValue
  // getValue:size:] PAC-faults on 18.6.2 in this realm) and uses
  // libffi-style ABI dispatch under the hood so FP regs get populated
  // correctly - our own #nativeCallAddr only sets x0..x7.
  function invokeStructSetter(obj, selectorName, bytesBuf) {
    log("iss[" + selectorName + "]: entry obj=0x" + u64(obj).toString(16));
    if (!isNonZero(obj)) return false;
    const s = sel(selectorName);
    if (!isNonZero(s)) return false;
    const sig = Native.callSymbol("objc_msgSend", obj,
      sel("methodSignatureForSelector:"), s);
    if (!isNonZero(sig)) { log("iss: nil sig for " + selectorName); return false; }
    const NSInvocation = Native.callSymbol("objc_getClass", "NSInvocation");
    if (!isNonZero(NSInvocation)) { log("iss: NSInvocation class missing"); return false; }
    // +invocationWithMethodSignature: returns AUTORELEASED. JSC's
    // ObjCCallbackFunctionImpl::call wraps each bridge call in its own
    // @autoreleasepool {} that drains when the call returns - the inv
    // dies before our next bridge call (setTarget:) dispatches on it,
    // and we PAC-faulted there at 165909.ips. Use alloc + private
    // _initWithMethodSignature: instead: alloc returns +1 retained,
    // _initWithMethodSignature: preserves the +1, no autorelease
    // balance for JSC to drain. _initWithMethodSignature: is the
    // underlying initializer that the public class method calls into;
    // it's been a Foundation private since iOS 10 and is callable via
    // objc_msgSend with no special handling.
    const allocated = objc(NSInvocation, "alloc");
    if (!isNonZero(allocated)) { log("iss: NSInvocation alloc failed"); return false; }
    const inv = objc(allocated, "_initWithMethodSignature:", sig);
    if (!isNonZero(inv)) { log("iss: _initWithMethodSignature: returned nil"); return false; }
    log("iss: inv=0x" + u64(inv).toString(16));
    objc(inv, "setTarget:", obj);
    objc(inv, "setSelector:", s);
    const mem = Native.callSymbol("malloc", BigInt(bytesBuf.byteLength));
    Native.write(mem, bytesBuf);
    objc(inv, "setArgument:atIndex:", mem, 2n);
    objc(inv, "invoke");
    Native.callSymbol("free", mem);
    log("iss: done " + selectorName);
    return true;
  }

  function setLayerBounds(layer, x, y, w, h) {
    const buf = new ArrayBuffer(32);
    const dv = new DataView(buf);
    dv.setFloat64(0, x, true);
    dv.setFloat64(8, y, true);
    dv.setFloat64(16, w, true);
    dv.setFloat64(24, h, true);
    return invokeStructSetter(layer, "setBounds:", buf);
  }

  function setLayerPosition(layer, x, y) {
    const buf = new ArrayBuffer(16);
    const dv = new DataView(buf);
    dv.setFloat64(0, x, true);
    dv.setFloat64(8, y, true);
    return invokeStructSetter(layer, "setPosition:", buf);
  }

  function setLayerCornerRadius(layer, r) {
    const buf = new ArrayBuffer(8);
    new DataView(buf).setFloat64(0, r, true);
    return invokeStructSetter(layer, "setCornerRadius:", buf);
  }

  function nsValueFromCGPoint(x, y) {
    const mem = Native.callSymbol("malloc", 16n);
    const buf = new ArrayBuffer(16);
    const dv = new DataView(buf);
    dv.setFloat64(0, x, true);
    dv.setFloat64(8, y, true);
    Native.write(mem, buf);
    const typeEnc = Native.callSymbol("malloc", 32n);
    Native.writeString(typeEnc, "{CGPoint=dd}");
    const NSValue = Native.callSymbol("objc_getClass", "NSValue");
    const v = objc(NSValue, "valueWithBytes:objCType:", mem, typeEnc);
    Native.callSymbol("free", mem);
    Native.callSymbol("free", typeEnc);
    return v;
  }

  function nsNumberLL(val) {
    const NSNumber = Native.callSymbol("objc_getClass", "NSNumber");
    if (!isNonZero(NSNumber)) return 0n;
    // +numberWithLongLong: returns autoreleased and dies on JSC's
    // per-call pool drain (175118.ips: same class of crash as v6's
    // NSInvocation). Use alloc + initWithLongLong: for +1 retained.
    const allocated = objc(NSNumber, "alloc");
    if (!isNonZero(allocated)) return 0n;
    return objc(allocated, "initWithLongLong:", BigInt(val));
  }

  function readScreenBounds() {
    // Can't call -[UIScreen bounds] directly (returns CGRect in FP regs),
    // and -[NSValue getValue:size:] PAC-faults on our bridge on 18.6.2
    // (deprecated method cache). Hardcode a conservative default that
    // works for every modern iPhone width (375-440pt). The overlay
    // stretches across the full screen anyway, so being a few points
    // off just means the black background doesn't hug the edges.
    return { w: 402, h: 874 };
  }

  function getBatteryTempC() {
    const dict = Native.callSymbol("IOServiceMatching", "AppleSmartBattery");
    if (!isNonZero(dict)) { log("statbar: IOServiceMatching failed"); return null; }
    // IOServiceGetMatchingService consumes the dict ref, no CFRelease.
    const svc = Native.callSymbol("IOServiceGetMatchingService", 0n, dict);
    if (!isNonZero(svc)) { log("statbar: no AppleSmartBattery service"); return null; }
    const key = cfstr("Temperature");
    const prop = Native.callSymbol("IORegistryEntryCreateCFProperty", svc, key, 0n, 0n);
    let result = null;
    if (isNonZero(prop)) {
      const scratch = Native.callSymbol("malloc", 8n);
      writeU64(scratch, 0);
      // kCFNumberSInt64Type = 4
      Native.callSymbol("CFNumberGetValue", prop, 4n, scratch);
      const raw = Native.readPtr(scratch);
      Native.callSymbol("free", scratch);
      Native.callSymbol("CFRelease", prop);
      // Centidegrees Celsius -> degrees C.
      result = Number(BigInt.asIntN(64, raw)) / 100.0;
    } else {
      log("statbar: no Temperature property");
    }
    Native.callSymbol("IOObjectRelease", svc);
    return result;
  }

  function getPhysMemMB() {
    const NSProcessInfo = Native.callSymbol("objc_getClass", "NSProcessInfo");
    if (!isNonZero(NSProcessInfo)) return 0;
    const pi = objc(NSProcessInfo, "processInfo");
    if (!isNonZero(pi)) return 0;
    const bytes = u64(objc(pi, "physicalMemory"));
    return Number(bytes / (1024n * 1024n));
  }

  // Live free RAM from the kernel via host_statistics64(HOST_VM_INFO64).
  // -[NSProcessInfo physicalMemory] returns a constant (the installed
  // RAM total) and never changes, so the prior code looked frozen even
  // though the refresh loop was firing - the user wants a moving
  // number. host_statistics64 reads vm_statistics64 from the kernel
  // each call, including the current free_count which moves as the
  // system allocates/reclaims pages.
  //
  // vm_statistics64 layout (mach/vm_statistics.h):
  //   offset 0x00: free_count        (natural_t = uint32)
  //   offset 0x04: active_count      (natural_t)
  //   offset 0x08: inactive_count    (natural_t)
  //   offset 0x0c: wire_count        (natural_t)
  //   ... (more fields, ~152 bytes total)
  //
  // HOST_VM_INFO64 = 4. HOST_VM_INFO64_COUNT is computed as
  // sizeof(vm_statistics64_data_t) / sizeof(integer_t) ~= 38; we pass
  // 64 to be safe (the kernel returns the actual count it filled).
  // Page size on iOS arm64 is 16384 bytes.
  function getFreeMemGB() {
    const host = Native.callSymbol("mach_host_self");
    if (!isNonZero(host)) return 0;
    const stat = Native.callSymbol("malloc", 256n);
    const countPtr = Native.callSymbol("malloc", 4n);
    if (!isNonZero(stat) || !isNonZero(countPtr)) return 0;
    writeU32(countPtr, 64);
    const HOST_VM_INFO64 = 4;
    const ret = Native.callSymbol("host_statistics64", host, HOST_VM_INFO64, stat, countPtr);
    let result = 0;
    if (Number(ret) === 0) {
      const freePages = Native.read32(stat);
      const PAGE_SIZE = 16384;
      const bytes = freePages * PAGE_SIZE;
      result = bytes / (1024 * 1024 * 1024);
    }
    Native.callSymbol("free", stat);
    Native.callSymbol("free", countPtr);
    return result;
  }

  // Live network speed (download / upload KB/s) from interface byte
  // counters via getifaddrs. The kernel exposes per-interface ifi_ibytes
  // / ifi_obytes counters in struct if_data; we sum across non-loopback
  // interfaces, snapshot the totals each tick, and divide the delta by
  // elapsed seconds to get instantaneous bytes/sec, then by 1024 for
  // kilobytes/sec.
  //
  // Layout:
  //   struct ifaddrs {                 // 56-byte struct on arm64
  //     struct ifaddrs *ifa_next;      // 0
  //     char           *ifa_name;      // 8
  //     unsigned int    ifa_flags;     // 16 (+4 pad to align next ptr)
  //     struct sockaddr*ifa_addr;      // 24
  //     struct sockaddr*ifa_netmask;   // 32
  //     struct sockaddr*ifa_dstaddr;   // 40
  //     void           *ifa_data;      // 48
  //   };
  //   struct sockaddr {                // first two bytes are sa_len, sa_family
  //     u_int8_t        sa_len;        // 0
  //     sa_family_t     sa_family;     // 1 (u_int8_t on iOS)
  //     ...
  //   };
  //   struct if_data (returned in ifa_data when sa_family == AF_LINK=18):
  //     ... 8 u_chars at 0..7
  //     u_int32_t ifi_mtu, ifi_metric, ifi_baudrate, ifi_ipackets,
  //               ifi_ierrors, ifi_opackets, ifi_oerrors, ifi_collisions
  //     u_int32_t ifi_ibytes;          // 40
  //     u_int32_t ifi_obytes;          // 44
  //     ...
  //
  // 32-bit byte counters wrap at 4 GiB. At 1Hz tick + typical mobile
  // throughput we never wrap mid-tick, but we clamp negative deltas
  // (i.e. wraparound between snapshots) to 0 just in case.
  function getNetSpeedMBps() {
    const out = { down: 0, up: 0 };
    const ptrSlot = Native.callSymbol("malloc", 8n);
    if (!isNonZero(ptrSlot)) return out;
    writeU64(ptrSlot, 0);
    const rc = Native.callSymbol("getifaddrs", ptrSlot);
    if (Number(rc) !== 0) {
      Native.callSymbol("free", ptrSlot);
      return out;
    }
    const head = Native.readPtr(ptrSlot);
    Native.callSymbol("free", ptrSlot);

    let totalIn = 0n;
    let totalOut = 0n;
    let cur = head;
    let safety = 0;
    while (isNonZero(cur) && safety < 64) {
      safety++;
      const next = Native.readPtr(cur);
      const namePtr = Native.readPtr(cur + 8n);
      const addrPtr = Native.readPtr(cur + 24n);
      const dataPtr = Native.readPtr(cur + 48n);

      if (isNonZero(addrPtr) && isNonZero(dataPtr) && isNonZero(namePtr)) {
        // Read sa_family at byte 1 of sockaddr.
        const head4 = Native.read(addrPtr, 4);
        const sa_family = new Uint8Array(head4)[1];
        if (sa_family === 18) { // AF_LINK
          // Skip loopback interfaces (lo0, lo1, ...). IFNAMSIZ = 16
          // is the cap, but every iOS interface name fits in 8 chars
          // and is null-terminated.
          const name = Native.readString(namePtr, 16);
          if (name && name.indexOf("lo") !== 0) {
            const ibytes = u64(Native.read32(dataPtr + 40n));
            const obytes = u64(Native.read32(dataPtr + 44n));
            totalIn += ibytes;
            totalOut += obytes;
          }
        }
      }
      cur = next;
    }
    if (isNonZero(head)) Native.callSymbol("freeifaddrs", head);

    const now = Date.now() / 1000.0;
    const prev = globalThis.__statbar_net_prev;
    globalThis.__statbar_net_prev = { time: now, ibytes: totalIn, obytes: totalOut };
    if (!prev) return out;

    const dt = now - prev.time;
    if (dt <= 0) return out;

    let din = totalIn - prev.ibytes;
    let dout = totalOut - prev.obytes;
    if (din < 0n) din = 0n;
    if (dout < 0n) dout = 0n;

    out.down = Number(din) / dt / 1024;
    out.up = Number(dout) / dt / 1024;
    return out;
  }

  function findWindowScene(app) {
    // -[UIApplication connectedScenes] returns a copied NSSet whose
    // allObjects trampoline PAC-faults on our bridge (same slab/cache
    // trap as the earlier iconListViews ,C copy issue). Use the
    // single-object keyWindow.windowScene path instead. keyWindow is
    // technically deprecated on 18.x but the getter is still present in
    // UIKitCore (verified via class dump) and returns an unboxed
    // retained UIWindow we can message safely.
    log("fws: pre keyWindow");
    const key = objc(app, "keyWindow");
    log("fws: keyWindow=0x" + u64(key).toString(16));
    if (isNonZero(key)) {
      log("fws: pre windowScene");
      const sc = objc(key, "windowScene");
      log("fws: windowScene=0x" + u64(sc).toString(16));
      if (isNonZero(sc)) return sc;
    }
    // Last-resort fallback: -[UIApplication windows] (also a copied
    // NSArray, may PAC-fault, but worth trying if keyWindow was nil).
    log("fws: pre windows[0] fallback");
    const wins = objc(app, "windows");
    log("fws: windows=0x" + u64(wins).toString(16));
    if (!isNonZero(wins)) return 0n;
    const w0 = objc(wins, "objectAtIndex:", 0n);
    log("fws: w0=0x" + u64(w0).toString(16));
    if (!isNonZero(w0)) return 0n;
    const sc2 = objc(w0, "windowScene");
    log("fws: windowScene fb=0x" + u64(sc2).toString(16));
    return sc2;
  }

  function nsStr(str) {
    // NSString stringWithUTF8String:. We can't use cfstr (CFString)
    // everywhere because CALayer/UIView KVC on 18.x PAC-faults when the
    // key is a toll-free bridged CFString instead of a real NSString;
    // the KVC accessor cache signs an IMP under an isa the bridge
    // doesn't recognize. stringWithUTF8String: gives us a real
    // __NSCFConstantString with the expected isa signing.
    const NSString = Native.callSymbol("objc_getClass", "NSString");
    return objc(NSString, "stringWithUTF8String:", str);
  }

  // Build the custom status bar text from live device metrics. Format:
  // Fahrenheit + RAM in GB, two decimals each, separated by a vertical
  // pipe, e.g. "98.60{deg}F | 7.00GB" (where {deg} is U+00B0).
  //
  // The degree sign is constructed at runtime as the UTF-8 byte
  // sequence (0xC2 0xB0) via String.fromCharCode so the JS source
  // stays ASCII (per repo rule that chain delivery byte-counts the
  // payload). Native.writeString writes each JS char's lower 8 bits
  // verbatim, so a 2-char JS string of 0xC2/0xB0 lands in the C
  // buffer as valid UTF-8 for the degree sign; NSString's
  // initWithUTF8String: then decodes it into the real Unicode char.
  function buildStatBarText() {
    const tempC = getBatteryTempC();
    const freeRamGB = getFreeMemGB();
    const parts = [];
    const DEG = String.fromCharCode(0xC2) + String.fromCharCode(0xB0);
    // U+2193 DOWNWARDS ARROW + U+2191 UPWARDS ARROW, encoded as UTF-8
    // bytes via String.fromCharCode so JS source stays ASCII.
    const ARROW_DOWN = String.fromCharCode(0xE2) + String.fromCharCode(0x86) + String.fromCharCode(0x93);
    const ARROW_UP   = String.fromCharCode(0xE2) + String.fromCharCode(0x86) + String.fromCharCode(0x91);
    // Stationary-text padding: each numeric slot pads to a fixed VISUAL
    // width so the string never changes width between ticks. Combined
    // with the monospacedDigit font (set in applyOverlayStyle), this
    // keeps every digit at the same pixel position frame-to-frame -
    // no center-align wobble when one value goes from 3 digits to 4,
    // no per-digit width drift between "8" and "9".
    //
    // Padding char is U+2007 FIGURE SPACE (UTF-8: 0xE2 0x80 0x87), not
    // ASCII space. In tabular-digit fonts (which monospacedDigit gives
    // us) only the digits are fixed-width; the regular ASCII space is
    // still proportional and would offset the digit column by a few
    // pixels per pad char. FIGURE SPACE is defined by Unicode to share
    // the digit advance width exactly, so leading FIGURE SPACEs give
    // perfect right-alignment of the numeric column.
    //
    // padLeft inputs are always ASCII (digits + ".") so s.length IS the
    // visual column count of the input. The function pads with as many
    // FIGURE SPACE glyphs as needed to reach `visualWidth` visual
    // columns. JS string length of the result is larger (each FIGURE
    // SPACE is 3 UTF-8 bytes / 3 JS char codes) but that doesn't
    // matter - we hand the bytes to -[NSString initWithUTF8String:],
    // which decodes them into a single Unicode glyph each.
    //
    // Visual widths:
    //   - tempNum / ramNum: 6 cols covers "  0.00" through "999.99".
    //   - netNum: 7 cols covers "   0.00" through "1023.99" (full KB
    //     regime up to the MB switchover; MB-side max ~"999.99" fits
    //     too).
    const FIG_SPACE = String.fromCharCode(0xE2) + String.fromCharCode(0x80) + String.fromCharCode(0x87);
    function padLeft(s, visualWidth) {
      const need = visualWidth - s.length;
      if (need <= 0) return s;
      let pad = "";
      for (let i = 0; i < need; i++) pad += FIG_SPACE;
      return pad + s;
    }
    if (tempC !== null && tempC > 0) {
      const v = STATBAR_USE_CELSIUS ? tempC : (tempC * 9 / 5 + 32);
      const u = STATBAR_USE_CELSIUS ? "C" : "F";
      parts.push(padLeft(v.toFixed(2), 6) + DEG + u);
    }
    if (freeRamGB > 0) {
      // Show in GB by default; flip to MB when under 1 GB so the user
      // sees meaningful precision in low-memory situations.
      if (freeRamGB < 1) {
        parts.push(padLeft((freeRamGB * 1024).toFixed(2), 6) + "MB");
      } else {
        parts.push(padLeft(freeRamGB.toFixed(2), 6) + "GB");
      }
    }
    if (STATBAR_SHOW_NET) {
      const net = getNetSpeedMBps();
      // Whole-number throughput, per-direction. Sub-KB rates render in
      // bytes (so 0-1023 are visible instead of "0.00 KB" forever);
      // 1-1023 KB/s render as KB; 1024+ as MB. The token sits flush
      // against its arrow with NO leading figure-space pad - small
      // values like "0B" stay tight, large values like "1023KB" extend
      // the slot rightward. The temp and RAM columns ahead of the net
      // section are still padded, so the {down} arrow's position is
      // stable; only {up} shifts right when {down} grows in digits.
      //
      // getNetSpeedMBps already clamps wraparound deltas to >= 0
      // (see CLAUDE.md "32-bit counter wraparound" note).
      function fmtNet(kbValue) {
        if (kbValue < 1) {
          return Math.round(kbValue * 1024) + "B";
        }
        if (kbValue < 1024) {
          return Math.round(kbValue) + "KB";
        }
        return Math.round(kbValue / 1024) + "MB";
      }
      parts.push(ARROW_DOWN + fmtNet(net.down) + " " + ARROW_UP + fmtNet(net.up));
    }
    if (!parts.length) return "n/a";
    return parts.join(" | ");
  }

  // Resolve the status bar string view classes Huy's tweak targets, the
  // same way his constructor does it (objc_getClass by name). On 18.6.2
  // we expect STUIStatusBarStringView to exist in the loaded runtime.
  // Returns {cls17, cls16} - either or both can be 0n.
  function resolveStatusBarClasses() {
    const cls17 = Native.callSymbol("objc_getClass", "STUIStatusBarStringView");
    const cls16 = Native.callSymbol("objc_getClass", "_UIStatusBarStringView");
    log("statbar: cls17 (STUIStatusBarStringView)=0x" + u64(cls17).toString(16));
    log("statbar: cls16 (_UIStatusBarStringView)=0x"  + u64(cls16).toString(16));
    return { cls17: cls17, cls16: cls16 };
  }

  // Recursively walk a view tree, collecting any descendant whose class
  // is cls1 OR cls2 (either can be 0n) using -isKindOfClass: against the
  // resolved Class pointer. isKindOfClass: handles private subclasses,
  // NSKVONotifying_ isa-swizzled variants, and rename chains that a
  // string compare on class_getName would miss. Uses only pointer-arg
  // ObjC calls (subviews / count / objectAtIndex: / isKindOfClass:) so
  // the x-only bridge handles it fine. Bounded depth + per-level cap
  // keep a pathological tree from blowing the JS stack.
  //
  // visited[] is a mutable counter (one-element array) that tracks total
  // views visited so the caller can distinguish 'walked nothing' from
  // 'walked a lot and found nothing'. Depth cap intentionally lower than
  // before (was 20) because we now walk the status bar window specifically
  // instead of the deep keyWindow tree.
  function walkFindStatusBarLabels(view, cls1, cls2, out, depth, visited) {
    if (depth > 10) return;
    if (!isObjcReceiver(view)) return;
    visited[0] = visited[0] + 1;
    if (isNonZero(cls1)) {
      const m1 = objc(view, "isKindOfClass:", cls1);
      if (isNonZero(m1)) { out.push(view); return; }
    }
    if (isNonZero(cls2)) {
      const m2 = objc(view, "isKindOfClass:", cls2);
      if (isNonZero(m2)) { out.push(view); return; }
    }
    // -[UIView subviews] returns the strongly-owned _subviewCache ivar
    // directly (verified via UIKitCore decompile on 18.6.2: lazy-builds
    // and stores via objc_storeStrong at offset 56, then returns the
    // ivar value). Survives JSC's autoreleasepool drain because the
    // view holds it strongly. Same for -objectAtIndex: which returns a
    // +0 reference owned by the array.
    const subs = objc(view, "subviews");
    if (!isObjcReceiver(subs)) return;
    const cntRaw = objc(subs, "count");
    const cnt = Number(u64(cntRaw));
    if (cnt <= 0) return;
    const lim = cnt < 64 ? cnt : 64;
    for (let i = 0; i < lim; i++) {
      const sub = objc(subs, "objectAtIndex:", BigInt(i));
      if (!isObjcReceiver(sub)) continue;
      walkFindStatusBarLabels(sub, cls1, cls2, out, depth + 1, visited);
    }
  }

  // Find the status bar string view instance.
  //
  // Fast path: if we found it on a previous tick, reuse the cached pointer.
  // The system status bar label is retained by its superview for the full
  // lifetime of SpringBoard, so the pointer stays valid across ticks and
  // we never need to rewalk.
  //
  // Slow path: enter via SBWindowSceneStatusBarManager. Walking
  // -[UIWindowScene windows] used to seem attractive ("walk every window
  // attached to the scene"), but that returns a fresh autoreleased
  // NSArray with no other strong owner - JSC's per-callback
  // autoreleasepool drains the array before the next bridge call, and
  // -count or objc_retain on it then PAC-faults / SIGBUSes. The
  // SBWindowSceneStatusBarManager singleton holds its STUIStatusBar_Wrapper
  // via the strong _statusBar ivar, so the wrapper survives drain and we
  // can walk it via -subviews (which returns the strongly-held
  // _subviewCache ivar, also survives) all the way down to the
  // STUIStatusBarStringView labels.
  function findStatusBarClockLabel(app, classes) {
    // Re-walk every tick. Caching the label across ticks is unsafe in
    // the loop - if SpringBoard rebuilt the status bar between ticks
    // (rotation, scene swap, status-bar style refresh, etc.) the
    // cached pointer would point at a freed STUIStatusBarStringView and
    // setText: would PAC-fault. The walk itself is cheap (manager call
    // + 16-view subview traversal, ~5ms) and re-derives a fresh, live
    // label from the manager's strong _statusBar ivar each tick, so we
    // get free liveness validation for the price of a few ObjC dispatches.
    log("statbar: resolving via SBWindowSceneStatusBarManager");

    // Skip the scene.windows enumeration entirely - that path goes
    // through -[UIWindowScene windows] which builds a fresh autoreleased
    // NSArray via _allWindowsIncludingInternalWindows: + filteredArray,
    // and that fresh array has no strong owner so JSC's pool drain
    // deallocs it the moment the bridge call returns. Three crash reports
    // (020440, 123827, 130359) all faulted because the next bridge call
    // dereferenced the dead array. Use SBWindowSceneStatusBarManager's
    // singleton-ish accessor instead - the manager is held by the embedded
    // scene, and its _statusBar ivar holds the wrapper strongly. Both
    // survive drain. Verified on 18.6.2 SpringBoard:
    //   +windowSceneStatusBarManagerForEmbeddedDisplay -> manager
    //   manager._statusBar (strong ivar) -> STUIStatusBar_Wrapper
    const candidates = [];
    const visited = [0];
    const Manager = Native.callSymbol("objc_getClass", "SBWindowSceneStatusBarManager");
    log("statbar: SBWindowSceneStatusBarManager=0x" + u64(Manager).toString(16));
    if (!isObjcReceiver(Manager)) {
      log("statbar: manager class missing - bailing");
      return 0n;
    }
    const mgr = objc(Manager, "windowSceneStatusBarManagerForEmbeddedDisplay");
    log("statbar: mgr=0x" + u64(mgr).toString(16));
    if (!isObjcReceiver(mgr)) {
      log("statbar: windowSceneStatusBarManagerForEmbeddedDisplay returned nil - bailing");
      return 0n;
    }
    const wrapper = objc(mgr, "statusBar");
    log("statbar: mgr.statusBar=0x" + u64(wrapper).toString(16));
    if (!isObjcReceiver(wrapper)) {
      log("statbar: mgr.statusBar nil - bailing");
      return 0n;
    }
    walkFindStatusBarLabels(wrapper, classes.cls17, classes.cls16, candidates, 0, visited);
    log("statbar: walk visited=" + visited[0] + " candidates=" + candidates.length);
    log("statbar: walk total visited=" + visited[0] + " candidates=" + candidates.length);

    if (candidates.length === 0) return 0n;

    // Prefer a candidate whose current text contains ':' (the clock line)
    // so we don't clobber cellular / SSID labels. The colon NSString
    // uses the +1 alloc/init pattern - +stringWithUTF8String: would die
    // on the first iteration's pool drain. -[UILabel text] returns the
    // strongly-held _text ivar (same shape as -subviews), survives drain.
    const colon = nsStrRetained(":");
    if (!isObjcReceiver(colon)) {
      log("statbar: colon string alloc failed - skipping ':' preference");
    }
    for (let i = 0; i < candidates.length; i++) {
      if (!isObjcReceiver(candidates[i])) continue;
      const txt = objc(candidates[i], "text");
      if (!isObjcReceiver(txt)) continue;
      if (!isObjcReceiver(colon)) break;
      const hit = objc(txt, "containsString:", colon);
      if (isNonZero(hit)) {
        log("statbar: picked candidate " + i + " (has ':' in current text)");
        return candidates[i];
      }
    }
    if (!isObjcReceiver(candidates[0])) {
      log("statbar: candidate 0 not a plausible ObjC pointer - bailing");
      return 0n;
    }
    log("statbar: no ':' candidate, picking candidate 0");
    return candidates[0];
  }

  // Emulation of 34306/excalibur/darksword-kexploit-fun/StatusBarTweak.m
  // in JS against the BrokenBlade Native bridge.
  //
  // Huy's tweak is a dylib that dlopens into SpringBoard and, in its
  // constructor, does exactly this:
  //
  //   Class cls17 = objc_getClass("STUIStatusBarStringView");  // iOS 17+
  //   Class cls16 = objc_getClass("_UIStatusBarStringView");   // iOS 16
  //   if (cls17) hookClass(cls17);  // method_setImplementation(-setText:)
  //   if (cls16) hookClass(cls16);
  //
  // His hook body then checks whether the incoming text contains ':' and,
  // if so, replaces it with a custom date/time attributed string. The
  // hook catches EVERY -setText: call on those classes system-wide -
  // there's no view hierarchy walking at all.
  //
  // Our JS bridge doesn't have block or imp_implementationWithBlock
  // infrastructure, so we can't install a method swizzle from here. But
  // we can port the underlying insight: resolve the exact same Class
  // pointers via objc_getClass by name, and then find a live instance
  // to poke. Finding an instance means walking the UI tree once, which
  // Huy's tweak avoids via the swizzle but which we have to do manually.
  //
  // Every ObjC call on this path is pointer-or-integer only: objc_getClass
  // / sharedApplication / keyWindow / subviews / count / objectAtIndex: /
  // isKindOfClass: / text / containsString: / setText:. Nothing touches
  // d0..d7 and nothing depends on CGRect/CGPoint/CGFloat marshalling, so
  // the whole SIGBUS surface from the prior VFL and CALayer paths is
  // gone.
  //
  // This is still one-shot: iOS will re-set the clock text on the next
  // minute tick. Re-inject sbcustomizer with __sbc_statbar=1 to refresh.
  // Tag for the StatBar UILabel inside our dedicated overlay window.
  const STATBAR_OVERLAY_TAG = 99421;

  // Position centered just below the Dynamic Island on iPhone 16 Pro
  // Max. Logical screen 440x956pt. Dynamic Island sits ~y=11..48 with
  // its center around x=220 (screen midpoint). y=54 places the top
  // edge a few points under the island's bottom curve so the text
  // doesn't kiss the silhouette.
  //
  // Pill width is content-driven: with net speed shown the typical
  // text is ~36 chars at 11.5pt
  // ("98.60{deg}F | 7.00GB | {dn}123.45 {up}45.67 KB"), fits comfortably
  // at 220pt. Worst case (5-digit speeds at peak wifi/cellular) may
  // truncate slightly but UILabel handles overflow gracefully. Without
  // net it's ~16 chars ("98.60{deg}F | 7.00GB"), 130pt is plenty.
  const STATBAR_WIN_Y = 54;
  const STATBAR_WIN_H = 18;

  // Temperature unit. Default Fahrenheit. Set via the StatBar tweak's
  // sheet (statbarCelsius checkbox) which threads through the chain
  // delivery as globalThis.__sbc_statbar_celsius (0/1).
  const STATBAR_USE_CELSIUS = (globalThis.__sbc_statbar_celsius === 1 || globalThis.__sbc_statbar_celsius === true);

  // Network speed default-on. statbarHideNet UI toggle threads through
  // chain as globalThis.__sbc_statbar_hide_net (0/1) - inverted so
  // "off" / unchecked / undefined leaves net visible.
  const STATBAR_SHOW_NET = !(globalThis.__sbc_statbar_hide_net === 1 || globalThis.__sbc_statbar_hide_net === true);

  // Width budget for the longest plausible single-line render with
  // per-value units AND figure-space numeric padding. Tabular digits
  // average wider than proportional letters in SF Pro (~6.5pt vs ~5pt
  // at 11.5pt). With the whole-number / bytes-fallback net format
  // each direction now occupies a 6-col padded slot (was 7-col digits
  // + " KB" 3-col suffix = 10 cols). Worst-case padded render at
  // 11.5pt monospacedDigit:
  //   "  98.60{deg}F |   7.00GB | {down}1023KB {up}1023KB"
  //   = ~37 visible cols * ~6pt avg = ~222 pts.
  // 230 gives margin for per-device font-rendering variance.
  const STATBAR_WIN_W = STATBAR_SHOW_NET ? 230 : 140;
  const STATBAR_WIN_X = (440 - STATBAR_WIN_W) / 2;

  // Font size for the overlay text. Smaller than UILabel's default
  // 17pt system font - 11.5pt comfortably fits the formatted string
  // ("98.60{deg}F | 7.00GB", ~16 chars) in the 140pt-wide frame with
  // padding on each side for the rounded pill shape.
  const STATBAR_FONT_PT = 11.5;

  // windowLevel above CC (UIWindowLevelStatusBar=1000, alerts at 2000)
  // paired with canShowWhileLocked=YES so the overlay survives lock
  // screen / cover sheet / Control Center.
  const STATBAR_WIN_LEVEL = 999999;

  // Live-refresh interval. The overlay re-reads battery temp + RAM and
  // re-applies setText: every N seconds. 1s gives the user immediate
  // feedback when temp/RAM moves; per-tick cost is ~5-10ms cached-path
  // createStatBarOverlay so even at 1Hz we're using <1% of main thread.
  const STATBAR_LIVE_INTERVAL_SEC = 1.0;

  // Schedule a live refresh of the StatBar via
  // -[NSObject performSelector:withObject:afterDelay:] on the current
  // run loop. Each fire re-evaluates the script "__sbcust_statbar();"
  // against the JSContext, which re-runs createStatBarOverlay (cached-
  // window fast path) and ALSO calls scheduleStatBarRefresh() again to
  // queue the next tick. The whole loop runs on SpringBoard's main
  // thread; no worker thread, no bridge concurrency, no NSTimer block
  // synthesis.
  //
  // performSelector:withObject:afterDelay: takes the delay as an
  // NSTimeInterval (CGFloat = double). Bridge routes it through
  // Native.callSymbolFP - which is exactly what the FP-register support
  // unlocked.
  //
  // The script NSString is cached as a globalThis singleton so we don't
  // leak one NSString per schedule. cancelPreviousPerformRequestsWithTarget:
  // selector:object: dedupes any prior pending refresh on this same
  // (target, sel, object) tuple - keyed by isEqual: so the singleton
  // string matches itself across reruns.
  function scheduleStatBarRefresh() {
    if (!globalThis.__sbcust_refresh_script) {
      const s = nsStrRetained("__sbcust_statbar();");
      if (!isObjcReceiver(s)) {
        log("statbar: refresh script alloc failed");
        return false;
      }
      globalThis.__sbcust_refresh_script = s;
    }
    const script = globalThis.__sbcust_refresh_script;
    const ctx = globalThis.__sbcust_jsctx_obj;
    if (!isObjcReceiver(ctx)) {
      log("statbar: jsContextObj missing - can't schedule refresh");
      return false;
    }

    const NSObject = Native.callSymbol("objc_getClass", "NSObject");
    if (isObjcReceiver(NSObject)) {
      Native.callSymbol("objc_msgSend",
        NSObject,
        sel("cancelPreviousPerformRequestsWithTarget:selector:object:"),
        ctx,
        sel("evaluateScript:"),
        script);
    }

    // [ctx performSelector:@selector(evaluateScript:) withObject:script
    //               afterDelay:STATBAR_LIVE_INTERVAL_SEC];
    //   x0=ctx, x1=performSel, x2=evaluateSel, x3=script, d0=delay
    Native.callSymbolFP("objc_msgSend", [
      ctx,
      sel("performSelector:withObject:afterDelay:"),
      sel("evaluateScript:"),
      script,
    ], [STATBAR_LIVE_INTERVAL_SEC]);
    return true;
  }

  // Helper: objc_msgSend with FP args. Routes (receiver, sel, ...fpArgs)
  // through Native.callSymbolFP which writes d0..d7 in addition to x0..x7.
  // This is what the v6/v7/v8 attempts needed all along - rather than
  // building NSInvocation wrappers (which all autoreleased and died on
  // JSC's pool drain), we just pass the doubles directly through the
  // bridge that __invoking___ already supports.
  function objcSendFP(receiver, selectorName, fpArgs) {
    return Native.callSymbolFP("objc_msgSend",
      [receiver, sel(selectorName)],
      fpArgs);
  }

  // Round the overlay UILabel into a pill (corner radius = height/2).
  // -[UIView layer] returns the strongly-held _layer ivar (+0 owned by
  // the view, survives JSC pool drain). -[CALayer setCornerRadius:]
  // takes a CGFloat (FP bridge). masksToBounds=YES so the rounded
  // shape actually clips the background color rendering.
  function applyOverlayPillShape(label) {
    const layer = objc(label, "layer");
    if (!isObjcReceiver(layer)) return false;
    objcSendFP(layer, "setCornerRadius:", [STATBAR_WIN_H / 2]);
    objc(layer, "setMasksToBounds:", 1n);
    return true;
  }

  // Apply the smaller font + pill shape to a UILabel. Used by both
  // first-install and cached-window paths so re-injects after these
  // commits pick up the latest styling without invalidating the cache.
  function applyOverlayStyle(label) {
    const UIFont = Native.callSymbol("objc_getClass", "UIFont");
    if (isObjcReceiver(UIFont)) {
      // monospacedDigitSystemFontOfSize:weight: returns SF Pro with
      // tabular figures - digits 0..9 all share one fixed advance
      // width while letters stay proportional. This is the same font
      // iOS uses for the lock-screen clock and the system timer for
      // exactly the same reason: the rendered digit positions don't
      // shift as values tick. Combined with the leading-space padding
      // in buildStatBarText, every glyph in the pill stays at the
      // same pixel position frame-to-frame.
      //
      // Two FP args: size (CGFloat in d0) + weight (UIFontWeight = CGFloat in d1).
      // 0.0 == UIFontWeightRegular. UIFont caches the result class-wide,
      // so the autoreleased return survives JSC's pool drain (same as
      // systemFontOfSize: did before).
      const fontObj = Native.callSymbolFP("objc_msgSend",
        [UIFont, sel("monospacedDigitSystemFontOfSize:weight:")],
        [STATBAR_FONT_PT, 0.0]);
      if (isObjcReceiver(fontObj)) {
        objc(label, "setFont:", BigInt(fontObj));
      } else {
        // Fallback to proportional system font if monospacedDigit
        // is unavailable for some reason (shouldn't happen on iOS 18,
        // but cheap guard).
        const fallback = Native.callSymbolFP("objc_msgSend",
          [UIFont, sel("systemFontOfSize:")],
          [STATBAR_FONT_PT]);
        if (isObjcReceiver(fallback)) objc(label, "setFont:", BigInt(fallback));
      }
    }
    applyOverlayPillShape(label);
  }

  function createStatBarOverlay() {
    log("statbar: entry (v9 dedicated UIWindow via FP-reg bridge)");
    const UIApplication = Native.callSymbol("objc_getClass", "UIApplication");
    if (!isObjcReceiver(UIApplication)) { log("statbar: no UIApplication class"); return false; }
    const sharedSel = sel("sharedApplication");
    if (!isNonZero(sharedSel)) { log("statbar: no sharedApplication selector"); return false; }
    const app = Native.callSymbol("objc_msgSend", UIApplication, sharedSel);
    if (!isObjcReceiver(app)) { log("statbar: sharedApplication not a plausible ObjC pointer"); return false; }

    const text = buildStatBarText();
    log("statbar: text='" + text + "'");
    const textObj = nsStrRetained(text);
    if (!isObjcReceiver(textObj)) { log("statbar: nsStrRetained returned non-pointer"); return false; }

    // Persistence cache: associate the overlay UIWindow to
    // sharedApplication via objc_setAssociatedObject (RETAIN_NONATOMIC=1)
    // so re-injects find the same live window across runs. The key is
    // a malloc'd byte cached in globalThis so the address is stable.
    let assocKey = globalThis.__sbcust_statbar_assoc_key;
    if (!assocKey) {
      assocKey = Native.callSymbol("malloc", 1n);
      if (!isNonZero(assocKey)) { log("statbar: malloc(1) for assocKey failed"); return false; }
      globalThis.__sbcust_statbar_assoc_key = assocKey;
    }

    const cachedWin = Native.callSymbol("objc_getAssociatedObject", app, assocKey);
    if (isObjcReceiver(cachedWin)) {
      log("statbar: reusing cached overlay window 0x" + u64(cachedWin).toString(16));
      const cachedLabel = objc(cachedWin, "viewWithTag:", BigInt(STATBAR_OVERLAY_TAG));
      if (isObjcReceiver(cachedLabel)) {
        objc(cachedLabel, "setText:", textObj);
        // Re-apply frame + style each inject so layout/font/pill-shape
        // changes take effect without invalidating the assoc'd window.
        objcSendFP(cachedWin, "setFrame:", [STATBAR_WIN_X, STATBAR_WIN_Y, STATBAR_WIN_W, STATBAR_WIN_H]);
        objcSendFP(cachedLabel, "setFrame:", [0, 0, STATBAR_WIN_W, STATBAR_WIN_H]);
        applyOverlayStyle(cachedLabel);
        objc(cachedWin, "setHidden:", 0n);
        log("statbar: cached overlay text + frame + style updated, window unhidden");
        return true;
      }
      log("statbar: cached window had no tagged label - recreating");
    }

    // First-install: tear down any leftover v4 subview attached to the
    // clock label, then build the dedicated UIWindow.
    const classes = resolveStatusBarClasses();
    if (isObjcReceiver(classes.cls17) || isObjcReceiver(classes.cls16)) {
      const clockLabel = findStatusBarClockLabel(app, classes);
      if (isObjcReceiver(clockLabel)) {
        const v4Leftover = objc(clockLabel, "viewWithTag:", BigInt(STATBAR_OVERLAY_TAG));
        if (isObjcReceiver(v4Leftover)) {
          log("statbar: removing v4 leftover overlay 0x" + u64(v4Leftover).toString(16));
          objc(v4Leftover, "removeFromSuperview");
        }
      }
    }

    const keyWin = objc(app, "keyWindow");
    if (!isObjcReceiver(keyWin)) { log("statbar: keyWindow nil"); return false; }
    const scene = objc(keyWin, "windowScene");
    if (!isObjcReceiver(scene)) { log("statbar: windowScene nil"); return false; }

    // Build the dedicated UIWindow. Frame and windowLevel use the FP
    // bridge - no NSInvocation, no NSValue, no autoreleased wrappers.
    const UIWindow = Native.callSymbol("objc_getClass", "UIWindow");
    if (!isObjcReceiver(UIWindow)) { log("statbar: no UIWindow class"); return false; }
    const winAlloc = objc(UIWindow, "alloc");
    if (!isObjcReceiver(winAlloc)) { log("statbar: UIWindow alloc failed"); return false; }
    const win = objc(winAlloc, "initWithWindowScene:", scene);
    if (!isObjcReceiver(win)) { log("statbar: UIWindow initWithWindowScene: failed"); return false; }
    log("statbar: window=0x" + u64(win).toString(16));

    // setFrame:(CGRect) - 4 doubles (HFA, route through d0..d3).
    objcSendFP(win, "setFrame:", [STATBAR_WIN_X, STATBAR_WIN_Y, STATBAR_WIN_W, STATBAR_WIN_H]);
    // setWindowLevel:(CGFloat) - single double in d0.
    objcSendFP(win, "setWindowLevel:", [STATBAR_WIN_LEVEL]);
    objc(win, "setUserInteractionEnabled:", 0n);

    const UIColor = Native.callSymbol("objc_getClass", "UIColor");
    if (isObjcReceiver(UIColor)) {
      const clear = objc(UIColor, "clearColor");
      if (isObjcReceiver(clear)) objc(win, "setBackgroundColor:", clear);
    }

    const UILabel = Native.callSymbol("objc_getClass", "UILabel");
    if (!isObjcReceiver(UILabel)) { log("statbar: no UILabel class"); return false; }
    const labelAlloc = objc(UILabel, "alloc");
    if (!isObjcReceiver(labelAlloc)) { log("statbar: UILabel alloc failed"); return false; }
    const overlay = objc(labelAlloc, "init");
    if (!isObjcReceiver(overlay)) { log("statbar: UILabel init failed"); return false; }
    log("statbar: overlay label=0x" + u64(overlay).toString(16));

    objc(overlay, "setText:", textObj);
    objc(overlay, "setTag:", BigInt(STATBAR_OVERLAY_TAG));
    objc(overlay, "setTextAlignment:", 1n);
    if (isObjcReceiver(UIColor)) {
      const black = objc(UIColor, "blackColor");
      const white = objc(UIColor, "whiteColor");
      if (isObjcReceiver(black)) objc(overlay, "setBackgroundColor:", black);
      if (isObjcReceiver(white)) objc(overlay, "setTextColor:", white);
    }

    // Smaller font + pill shape via FP bridge. UIKit caches system
    // fonts at the class level so the autoreleased UIFont return
    // survives JSC's pool drain before setFont: dispatches - same
    // singleton-style retain pattern as +[UIColor blackColor].
    applyOverlayStyle(overlay);

    // Label fills the window (window-local coords).
    objcSendFP(overlay, "setFrame:", [0, 0, STATBAR_WIN_W, STATBAR_WIN_H]);

    objc(win, "addSubview:", overlay);

    // canShowWhileLocked KVC removed: that key is on UIViewController,
    // NOT UIWindow (verified via UIKitCore symbol dump - all
    // _canShowWhileLocked impls live on UIVC subclasses). Setting it via
    // KVC on a UIWindow raises NSUndefinedKeyException through
    // -[NSObject(NSKeyValueCoding) setValue:forKey:] -> setValue:
    // forUndefinedKey: -> _isUnarchived -> objc_exception_throw,
    // SIGABRT (182216.ips). For CC-survival we'd need a UIVC subclass
    // with -_canShowWhileLocked overridden, set as the window's root VC.
    // Out of scope for this iteration; ship the overlay without CC
    // resilience first.

    objc(win, "setHidden:", 0n);
    Native.callSymbol("objc_setAssociatedObject", app, assocKey, win, 1n);
    log("statbar: dedicated overlay window installed via FP bridge");
    return true;
  }

  function applyDockPatch(passTag) {
    if (!ENABLE_FIVEICON) {
      log("applyDockPatch(" + passTag + ") skipped: ENABLE_FIVEICON=false (StatBar-only run)");
      return false;
    }
    log("applyDockPatch(" + passTag + ") entered - running on main thread");
    const SBIconController = Native.callSymbol("objc_getClass", "SBIconController");
    if (!isNonZero(SBIconController)) {
      log("SBIconController missing - are we in SpringBoard?");
      return false;
    }
    log("SBIconController=0x" + u64(SBIconController).toString(16));

    const iconCtrl = objc(SBIconController, "sharedInstance");
    if (!isNonZero(iconCtrl)) {
      log("icon controller unavailable");
      return false;
    }

    const iconMgr = tryObjSelector(iconCtrl, ["iconManager"]);
    let dockListView = 0n;
    if (isNonZero(iconMgr)) {
      dockListView = tryObjSelector(iconMgr, ["dockListView"]);
    }
    if (!isNonZero(dockListView)) {
      dockListView = tryObjSelector(iconCtrl, ["dockListView"]);
    }
    if (!isNonZero(dockListView)) {
      log("dock list view unavailable");
      return false;
    }

    let model = tryObjSelector(dockListView, ["model", "iconListModel"]);
    if (!isNonZero(model)) {
      model = tryObjSelector(dockListView, ["displayedModel"]);
    }
    if (!isNonZero(model)) {
      log("dock model unavailable");
      return false;
    }

    let touched = 0;
    if (ENABLE_MODEL_GRID_SIZE_CHANGE && patchModelGridSize(model)) touched++;
    if (ENABLE_LAYOUT_COLUMN_PATCH && patchLayoutColumns(dockListView)) touched++;

    if (ENABLE_UNSAFE_IVAR_WRITES) {
      if (patchGridSize(model)) touched++;
    }

    if (ENABLE_FORCE_RELAYOUT && touched > 0) {
      forceRelayout(dockListView);
    }
    logGetterU64(dockListView, "iconsInRowForSpacingCalculation", "dockListView");
    logGetterU64(model, "maxNumberOfIcons", "model");
    logGetterU64(model, "numberOfIcons", "model");
    if (canRespond(model, "allowsAddingIconCount:")) {
      const canAdd = u64(objc(model, "allowsAddingIconCount:", 1n));
      log("model.allowsAddingIconCount(1)=" + canAdd.toString());
    }

    if (ENABLE_HOMESCREEN_COL_PATCH) {
      try {
        const rootTouched = patchHomescreenGrid(iconCtrl, HOMESCREEN_TARGET_COLS, HOMESCREEN_TARGET_ROWS);
        if (rootTouched > 0) touched++;
      } catch (hsErr) {
        log("patchHomescreenGrid threw: " + String(hsErr));
      }
      try {
        stabilizeRootListViews(iconCtrl);
      } catch (stabErr) {
        log("stabilizeRootListViews threw: " + String(stabErr));
      }
    }

    log("pass=" + passTag + " touched=" + touched + " dock=0x" + u64(dockListView).toString(16) + " model=0x" + u64(model).toString(16));
    return touched > 0;
  }

  // Speedster: traverse FBSettings domain hierarchy and patch live
  // sub-setting ivars on the singleton rootSettings instance iOS itself
  // reads. Verified on iOS 18.6.2 SpringBoardFoundation /
  // SpringBoardHome / SpringBoard via IDA decompile of the relevant
  // domain rootSettings + property accessors.
  //
  // Why not IMP swizzle: every setter we care about is a tight
  // STR D0/X0,[X0,#imm] style ivar setter, but each call is on a
  // transient settings object built per-animation and discarded. The
  // values that survive to runtime live on the parent rootSettings
  // singleton via property caches (e.g. SBHHomeScreenSettings.iconSettings,
  // SBSystemAnimationSettings.wakeAnimationSettings). We mutate THOSE
  // caches directly. The transient setters are bypassed.
  function applySpeedster(passTag) {
    if (!ENABLE_SPEEDSTER) {
      log("applySpeedster(" + passTag + ") skipped: ENABLE_SPEEDSTER=false (top-level Speedster tweak not enabled)");
      return false;
    }
    log("applySpeedster(" + passTag + ") entered jitter=" + SPEEDSTER_SUPPRESS_JITTER + " fastWake=" + SPEEDSTER_FAST_WAKE);
    if (!SPEEDSTER_SUPPRESS_JITTER && !SPEEDSTER_FAST_WAKE) {
      log("applySpeedster(" + passTag + ") WARNING: top-level Speedster is on but BOTH sub-features are off - tweak will do nothing. Open the Speedster info sheet and toggle 'Suppress home-screen jitter' and/or 'Faster screen wake'.");
      return false;
    }
    let applied = 0;

    if (SPEEDSTER_SUPPRESS_JITTER) {
      try {
        // -[SBIconView _addJitterAnimated:] reads
        //   [[[SBHHomeScreenDomain rootSettings] iconSettings] suppressJitter]
        // and bails immediately when YES. Verified at 0x1d7f7fc1c on
        // 18.6.2 SpringBoardHome.
        const SBHHomeScreenDomain = Native.callSymbol("objc_getClass", "SBHHomeScreenDomain");
        if (!isObjcReceiver(SBHHomeScreenDomain)) {
          log("speedster jitter: SBHHomeScreenDomain class not found - SpringBoardHome not loaded?");
        } else {
          const root = objc(SBHHomeScreenDomain, "rootSettings");
          if (!isObjcReceiver(root)) {
            log("speedster jitter: SBHHomeScreenDomain.rootSettings nil/invalid (0x" + u64(root).toString(16) + ")");
          } else {
            const iconSet = objc(root, "iconSettings");
            if (!isObjcReceiver(iconSet)) {
              log("speedster jitter: rootSettings.iconSettings nil/invalid (0x" + u64(iconSet).toString(16) + ")");
            } else {
              objc(iconSet, "setSuppressJitter:", 1n);
              const after = objc(iconSet, "suppressJitter");
              log("speedster jitter: setSuppressJitter:YES applied iconSettings=0x" + u64(iconSet).toString(16) + " readback=" + (Number(after) ? "YES" : "NO"));
              if (Number(after)) applied++;
            }
          }
        }
      } catch (e) {
        log("speedster jitter err: " + String(e));
      }
    }

    if (SPEEDSTER_FAST_WAKE) {
      try {
        // SBSystemAnimationDomain.rootSettings -> SBSystemAnimationSettings,
        // .wakeAnimationSettings property returns the cached
        // SBFWakeAnimationSettings instance whose ivars
        // -backlightFadeDuration / -speedMultiplierForWake /
        // -speedMultiplierForLiftToWake supply the actual values iOS
        // reads when waking the screen. Verified at
        // 0x18b7ca61c..0x18b7ca65c on 18.6.2 SpringBoardFoundation.
        // Setters take double (CGFloat) -> need FP bridge for d0.
        const SBSystemAnimationDomain = Native.callSymbol("objc_getClass", "SBSystemAnimationDomain");
        if (!isObjcReceiver(SBSystemAnimationDomain)) {
          log("speedster wake: SBSystemAnimationDomain class not found");
        } else {
          const root = objc(SBSystemAnimationDomain, "rootSettings");
          if (!isObjcReceiver(root)) {
            log("speedster wake: rootSettings nil/invalid (0x" + u64(root).toString(16) + ")");
          } else {
            const wake = objc(root, "wakeAnimationSettings");
            if (!isObjcReceiver(wake)) {
              log("speedster wake: rootSettings.wakeAnimationSettings nil/invalid (0x" + u64(wake).toString(16) + ")");
            } else {
              // FP bridge: setSpeedMultiplierForWake: takes double in d0
              Native.callSymbolFP("objc_msgSend",
                [wake, sel("setSpeedMultiplierForWake:")],
                [SPEEDSTER_WAKE_MULTIPLIER]);
              Native.callSymbolFP("objc_msgSend",
                [wake, sel("setSpeedMultiplierForLiftToWake:")],
                [SPEEDSTER_WAKE_MULTIPLIER]);
              Native.callSymbolFP("objc_msgSend",
                [wake, sel("setBacklightFadeDuration:")],
                [SPEEDSTER_BACKLIGHT_FADE_SEC]);
              // Readback for diagnostics. Reading FP ivars also goes
              // through d0 return path; use callSymbolFP + fpReturn(0).
              Native.callSymbolFP("objc_msgSend",
                [wake, sel("speedMultiplierForWake")],
                []);
              const wakeRead = Native.fpReturn(0);
              Native.callSymbolFP("objc_msgSend",
                [wake, sel("backlightFadeDuration")],
                []);
              const fadeRead = Native.fpReturn(0);
              log("speedster wake: applied wake=0x" + u64(wake).toString(16) + " mul=" + wakeRead.toFixed(3) + " fade=" + fadeRead.toFixed(3));
              applied++;
            }
          }
        }
      } catch (e) {
        log("speedster wake err: " + String(e));
      }
    }

    log("applySpeedster(" + passTag + ") done applied=" + applied);
    return applied > 0;
  }

  try {
    log("=== sbcustomizer_light.js entry ===");
    Native.init();
    log("Native.init() ok, baseAddr=0x" + new BigUint64Array(nativeCallBuff)[20].toString(16));
    const bi = Native.bridgeInfo();
    globalThis.__sbcust_jsctx_obj = bi.jsContextObj;
    globalThis.__sbcust_apply_once = applyDockPatch;
    globalThis.__sbcust_speedster = applySpeedster;
    globalThis.__sbcust_log = log;
    // Exposed so the polled reapply loop (and any external probe) can kick
    // a drift check + re-patch on the main thread via runOnMainEvaluate.
    // Idempotent: stable path is a pure read.
    globalThis.__sbcust_grid_reapply = function() {
      if (!ENABLE_HOMESCREEN_COL_PATCH) return;
      try {
        const SBIconControllerCls = Native.callSymbol("objc_getClass", "SBIconController");
        if (!isNonZero(SBIconControllerCls)) return;
        const iconCtrlLocal = objc(SBIconControllerCls, "sharedInstance");
        if (!isNonZero(iconCtrlLocal)) return;
        reapplyGridIfDrifted(iconCtrlLocal);
      } catch (e) {
        log("__sbcust_grid_reapply fatal: " + String(e));
      }
    };
    globalThis.__sbcust_statbar_consecutive_failures = 0;
    globalThis.__sbcust_statbar = function() {
      if (!ENABLE_STATBAR) return;
      if (!ENABLE_STATBAR_DISPATCH) {
        log("statbar: dispatch fenced - createStatBarOverlay disabled pending PAC fix (crash 2026-05-02-020440)");
        return;
      }
      try {
        const ok = createStatBarOverlay();
        if (ok) {
          globalThis.__sbcust_statbar_consecutive_failures = 0;
          // Live refresh: schedule the next tick. After 3 consecutive
          // failures we stop scheduling so a broken state doesn't churn
          // the main thread forever.
          scheduleStatBarRefresh();
        } else {
          globalThis.__sbcust_statbar_consecutive_failures++;
          if (globalThis.__sbcust_statbar_consecutive_failures >= 3) {
            log("statbar: 3 consecutive failures, halting live-refresh loop");
          } else {
            // Retry the refresh on the next tick anyway - transient
            // failures (e.g., status bar mid-rebuild) might resolve.
            scheduleStatBarRefresh();
          }
        }
      } catch (e) {
        log("statbar err: " + String(e));
        globalThis.__sbcust_statbar_consecutive_failures++;
        if (globalThis.__sbcust_statbar_consecutive_failures >= 3) {
          log("statbar: 3 consecutive failures, halting live-refresh loop");
        } else {
          scheduleStatBarRefresh();
        }
      }
    };

    log("loaded jsctx=0x" + u64(bi.jsctx).toString(16) + " jsContextObj=0x" + u64(bi.jsContextObj).toString(16));

    // PAC diagnostic: verify dlsym/memcpy/malloc pointers are non-zero
    const diagBuff = new BigUint64Array(nativeCallBuff);
    log("PAC ptrs: dlsym=0x" + diagBuff[21].toString(16) + " memcpy=0x" + diagBuff[22].toString(16) + " malloc=0x" + diagBuff[23].toString(16));
    log("PAC ptrs: paciaGadget=0x" + diagBuff[31].toString(16) + " kbase=0x" + diagBuff[30].toString(16));

    // Test a simple native call before touching ObjC
    const testMalloc = Native.callSymbol("malloc", 16n);
    log("test malloc=0x" + u64(testMalloc).toString(16) + (testMalloc ? " OK" : " FAILED"));
    if (testMalloc) Native.callSymbol("free", testMalloc);

    // Test dlsym works
    const testObjcGetClass = Native.callSymbol("dlsym", 0xfffffffffffffffen, "objc_getClass");
    log("test dlsym(objc_getClass)=0x" + u64(testObjcGetClass).toString(16));

    // Test objc_getClass before main dispatch
    const testSB = Native.callSymbol("objc_getClass", "SBIconController");
    log("test SBIconController=0x" + u64(testSB).toString(16) + (testSB ? " (found)" : " (NOT FOUND - wrong process?)"));

    log("about to runOnMainEvaluate (combined apply_once + statbar)");
    // Single combined dispatch: apply_once and statbar in one main-thread
    // script. Two separate runOnMainEvaluate calls (the prior pattern)
    // expose a race between the worker's dispatch return path and main's
    // concurrent bridge use - 141546.ips caught the worker mid-second-
    // dispatch with main 115ms into running apply_once, both writing to
    // callBuff and scrambling each other's args. One bridge call from
    // the worker means there's no second dispatch to overlap with main's
    // execution; after this returns the worker has zero further bridge
    // calls to make and just exits cleanly.
    runOnMainEvaluate("try{__sbcust_log('main-thread dispatch alive');__sbcust_apply_once('main-pass-1');__sbcust_statbar();__sbcust_speedster('main-pass-1');}catch(e){__sbcust_log('combined-dispatch err: '+e);}");

    if (ENABLE_SECOND_PASS) {
      Native.callSymbol("usleep", 1200000);
      log("about to runOnMainEvaluate pass 2");
      runOnMainEvaluate("try{__sbcust_apply_once('main-pass-2');}catch(e){__sbcust_log('main-pass-2 err: '+e);}");
      log("pass 2 dispatched");
    }

    // Statbar repeat loop. Runs on THIS injected worker thread, so usleep
    // here does NOT block SpringBoard's main thread - it only idles this
    // one injected pthread. Every tick we re-post __sbcust_statbar to
    // main thread via runOnMainEvaluate (the same performSelectorOnMainThread
    // / evaluateScript: bounce used for the initial dispatch) so the
    // repeated work stays on the UI thread where UIKit expects it.
    //
    // This is the closest we can get to 34306/excalibur's -setText: swizzle
    // without block/IMP fabrication in the bridge: iOS keeps overwriting
    // the clock label every ~minute, and we keep overwriting it back every
    // STATBAR_LOOP_INTERVAL_US microseconds.
    //
    // The loop is the very last thing the IIFE does. Once we enter it,
    // we never return through the outer try/catch under normal operation -
    // the injected worker thread just lives in the sleep/dispatch cycle
    // until either the hard cap is hit or another code path clears
    // __sbcust_statbar_loop_active.
    if (ENABLE_STATBAR && ENABLE_STATBAR_REPEAT_LOOP) {
      globalThis.__sbcust_statbar_loop_active = true;
      log("statbar: entering repeat loop (interval=" + STATBAR_LOOP_INTERVAL_US + "us max=" + STATBAR_LOOP_MAX_ITERS + ")");
      let tick = 0;
      while (globalThis.__sbcust_statbar_loop_active && tick < STATBAR_LOOP_MAX_ITERS) {
        Native.callSymbol("usleep", BigInt(STATBAR_LOOP_INTERVAL_US));
        try {
          // Piggyback the grid reapply on the statbar tick when both
          // features are enabled - they share the same injected worker
          // thread, so running two independent usleep loops on it isn't
          // possible anyway. Both are idempotent on the stable path.
          if (ENABLE_GRID_REAPPLY_LOOP) {
            runOnMainEvaluate("try{__sbcust_grid_reapply();}catch(e){__sbcust_log('grid reapply tick err: '+e);}try{__sbcust_statbar();}catch(e){__sbcust_log('statbar tick err: '+e);}");
          } else {
            runOnMainEvaluate("try{__sbcust_statbar();}catch(e){__sbcust_log('statbar tick err: '+e);}");
          }
        } catch (e) {
          log("statbar loop post err: " + String(e));
        }
        tick++;
      }
      log("statbar: loop exited after " + tick + " ticks (active=" + !!globalThis.__sbcust_statbar_loop_active + ")");
    } else if (ENABLE_STATBAR) {
      log("statbar: repeat loop disabled; snapshot dispatch only");
    } else if (ENABLE_GRID_REAPPLY_LOOP) {
      // Statbar is off but grid reapply is on - run a dedicated loop at a
      // slightly tighter interval. Same injected-thread usleep + main-thread
      // dispatch pattern as statbar; the stable path is just 8 ObjC reads
      // per tick and a single main-thread evaluate dispatch so the cost is
      // negligible. Drift-detected ticks run the full patch + relayout.
      globalThis.__sbcust_grid_loop_active = true;
      log("grid: entering reapply loop (interval=" + GRID_REAPPLY_INTERVAL_US + "us max=" + GRID_REAPPLY_MAX_ITERS + ")");
      let gtick = 0;
      while (globalThis.__sbcust_grid_loop_active && gtick < GRID_REAPPLY_MAX_ITERS) {
        Native.callSymbol("usleep", BigInt(GRID_REAPPLY_INTERVAL_US));
        try {
          runOnMainEvaluate("try{__sbcust_grid_reapply();}catch(e){__sbcust_log('grid tick err: '+e);}");
        } catch (e) {
          log("grid loop post err: " + String(e));
        }
        gtick++;
      }
      log("grid: reapply loop exited after " + gtick + " ticks (active=" + !!globalThis.__sbcust_grid_loop_active + ")");
    }
  } catch (e) {
    log("fatal: " + String(e) + " stack: " + (e.stack || "N/A"));
  }
})();
