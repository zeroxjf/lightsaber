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
  // Repeat-loop interval for the statbar overlay. We can't install a real
  // ObjC swizzle on -[STUIStatusBarStringView setText:] from JS (no IMP
  // fabrication in the bridge), so instead the injected worker thread
  // sleeps for this many microseconds and re-posts __sbcust_statbar to
  // main thread on every tick. Two seconds is slow enough not to saturate
  // the main runloop with view walks, fast enough that the overlay reads
  // as live.
  const STATBAR_LOOP_INTERVAL_US = 2000000;
  // Hard ceiling on loop iterations so a bug can't spin the injected
  // worker forever. 12h at 2s = 21600 ticks. The loop also exits early if
  // globalThis.__sbcust_statbar_loop_active is cleared from another
  // context.
  const STATBAR_LOOP_MAX_ITERS = 21600;
  // Home screen grid patch uses the SBHIconManager -> listLayoutProvider
  // path verified against the 18.6.2 SpringBoardHome class dump
  // (-[SBHIconManager listLayoutProvider], -[SBHDefaultIconListLayoutProvider
  // layoutForIconLocation:], -[SBIconListGridLayoutConfiguration
  // setNumberOfPortraitColumns:] / setNumberOfPortraitRows:).
  const ENABLE_HOMESCREEN_COL_PATCH = true;
  // StatBar: snapshot overlay window showing battery temp + total RAM.
  // Ported from Coruna-Tweaks-Collection/StatBar/StatBar.m. Snapshot only
  // (no NSTimer) because block-based timers need a real ObjC block we
  // can't synthesize from JS, and -performSelector:...afterDelay: takes
  // a double which our int-only bridge can't pass.
  const ENABLE_STATBAR = (globalThis.__sbc_statbar === 1 || globalThis.__sbc_statbar === true);
  // Hide icon labels - calls -[SBIconListGridLayoutConfiguration setShowsLabels:NO]
  // on the same cfg object we already get in patchHomescreenGrid. BOOL arg,
  // no FP regs, no new class lookups. Verified against 18.6.2 SpringBoardHome
  // dump (line 27063: -[SBIconListGridLayoutConfiguration setShowsLabels:]).
  const ENABLE_HIDE_LABELS = (globalThis.__sbc_hide_labels === 1 || globalThis.__sbc_hide_labels === true);

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
    objc(jsctxObj, "performSelectorOnMainThread:withObject:waitUntilDone:", sel("evaluateScript:"), s, 0);
    log("runOnMainEvaluate: performSelector returned, skipping CFRelease (main thread owns cfstr now)");
    // NOTE: Do NOT CFRelease the cfstr here. With waitUntilDone:NO, the main
    // thread retains/releases the object via performSelector's autorelease pool.
    // Releasing on the injected thread races with main thread access and causes
    // PAC violations on the release path (objc_release -> objc_msgSend with a
    // PAC-signed isa that was signed for main thread context).
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
  // The first version of this walked rootFolderController.iconListViews
  // (NSArray) and PAC-faulted on the respondsToSelector: call against the
  // returned array on 18.6.2 - the @property is declared with `,C` copy
  // semantics, so the getter hands back a fresh autoreleased copy each
  // time, and calling objc_msgSend on that copy tripped the method cache
  // PAC check. The rootFolder ivar itself is fine to message.
  //
  // This version skips the array walk entirely. It:
  //   1. Touches currentIconListView (SBFolderController @property
  //      "SBIconListView" R,N - no copy) to disable
  //      automaticallyAdjustsLayoutMetricsToFit on at least the visible
  //      page, verified line 28129 of the SpringBoardHome class dump.
  //   2. Calls -[SBFolderController layoutIconListsWithAnimationType:
  //      forceRelayout:] (line 7088) on rootFolder itself, which is what
  //      Atria's updateLayoutForRoot:forDock:animated: ultimately calls
  //      to push a uniform relayout across every list view in one step.
  //
  // Newly-created list views after install still start with auto-fit on,
  // but all existing ones get re-laid-out from the new provider config
  // in a single pass, which eliminates the "random mid-swipe size change"
  // symptom (pages laid out before vs after the stamp showing different
  // cached metrics).
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

    // Disable auto-fit on the current list view only. Single-object getter,
    // no array, no copy semantics - safe path after the iconListViews PAC
    // fault we hit in the previous version.
    if (canRespond(rootFolder, "currentIconListView")) {
      const curLv = objc(rootFolder, "currentIconListView");
      log("stabilizeRootListViews: currentIconListView=0x" + u64(curLv).toString(16));
      if (isNonZero(curLv)) {
        if (canRespond(curLv, "setAutomaticallyAdjustsLayoutMetricsToFit:")) {
          objc(curLv, "setAutomaticallyAdjustsLayoutMetricsToFit:", 0n);
          log("stabilizeRootListViews: disabled auto-fit on currentIconListView");
        } else {
          log("stabilizeRootListViews: no setAutomaticallyAdjustsLayoutMetricsToFit: on curLv");
        }
      }
    } else {
      log("stabilizeRootListViews: no currentIconListView selector");
    }

    // Force a uniform relayout pass so every existing root list view
    // rebuilds its metrics from the new provider config in one consistent
    // step. This is what Atria's updateLayoutForRoot:forDock:animated:
    // ends up calling.
    if (canRespond(rootFolder, "layoutIconListsWithAnimationType:forceRelayout:")) {
      log("stabilizeRootListViews: calling layoutIconListsWithAnimationType:0 forceRelayout:YES");
      objc(rootFolder, "layoutIconListsWithAnimationType:forceRelayout:", 0n, 1n);
      log("stabilizeRootListViews: forced relayout returned");
    } else {
      log("stabilizeRootListViews: no layoutIconListsWithAnimationType:forceRelayout: selector");
    }
    return 1;
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
    log("iss: pre sel");
    const s = sel(selectorName);
    log("iss: sel=0x" + u64(s).toString(16));
    if (!isNonZero(s)) return false;
    log("iss: pre methodSignatureForSelector");
    const sig = Native.callSymbol("objc_msgSend", obj,
      sel("methodSignatureForSelector:"), s);
    log("iss: sig=0x" + u64(sig).toString(16));
    if (!isNonZero(sig)) { log("iss: nil sig for " + selectorName); return false; }
    log("iss: pre objc_getClass NSInvocation");
    const NSInvocation = Native.callSymbol("objc_getClass", "NSInvocation");
    log("iss: NSInvocation=0x" + u64(NSInvocation).toString(16));
    log("iss: pre invocationWithMethodSignature:");
    const inv = objc(NSInvocation, "invocationWithMethodSignature:", sig);
    log("iss: inv=0x" + u64(inv).toString(16));
    if (!isNonZero(inv)) { log("iss: nil inv for " + selectorName); return false; }
    log("iss: pre setTarget:");
    objc(inv, "setTarget:", obj);
    log("iss: pre setSelector:");
    objc(inv, "setSelector:", s);
    log("iss: pre malloc/write " + bytesBuf.byteLength);
    const mem = Native.callSymbol("malloc", BigInt(bytesBuf.byteLength));
    Native.write(mem, bytesBuf);
    log("iss: mem=0x" + u64(mem).toString(16));
    log("iss: pre setArgument:atIndex:2");
    objc(inv, "setArgument:atIndex:", mem, 2n);
    log("iss: pre invoke");
    objc(inv, "invoke");
    log("iss: post invoke");
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
    return objc(NSNumber, "numberWithLongLong:", BigInt(val));
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

  // Build the custom status bar text from live device metrics.
  function buildStatBarText() {
    const tempC = getBatteryTempC();
    const ramMB = getPhysMemMB();
    let text = "";
    if (tempC !== null && tempC > 0) {
      const rounded = Math.round(tempC * 10) / 10;
      text += rounded.toFixed(1) + "C  ";
    }
    if (ramMB > 0) text += "RAM: " + ramMB + "MB";
    if (!text) text = "no data";
    return text;
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
    if (!isNonZero(view)) return;
    visited[0] = visited[0] + 1;
    if (isNonZero(cls1)) {
      const m1 = objc(view, "isKindOfClass:", cls1);
      if (isNonZero(m1)) { out.push(view); return; }
    }
    if (isNonZero(cls2)) {
      const m2 = objc(view, "isKindOfClass:", cls2);
      if (isNonZero(m2)) { out.push(view); return; }
    }
    const subs = objc(view, "subviews");
    if (!isNonZero(subs)) return;
    const cntRaw = objc(subs, "count");
    const cnt = Number(u64(cntRaw));
    if (cnt <= 0) return;
    const lim = cnt < 64 ? cnt : 64;
    for (let i = 0; i < lim; i++) {
      const sub = objc(subs, "objectAtIndex:", BigInt(i));
      if (!isNonZero(sub)) continue;
      walkFindStatusBarLabels(sub, cls1, cls2, out, depth + 1, visited);
    }
  }

  // Find the status bar string view instance.
  //
  // Fast path: if we found it on a previous tick, reuse the cached pointer.
  // The system status bar label is retained by its superview (owned by
  // SpringBoard's status bar scene) for the full lifetime of SpringBoard,
  // so the pointer stays valid across ticks and we never need to rewalk.
  //
  // Slow path: walk -[UIWindowScene windows] instead of keyWindow's subtree.
  // A previous attempt walked the keyWindow (211 views deep) and got 0
  // candidates because on 18.6.2 SpringBoard the status bar lives in its
  // own separate UIWindow inside the scene, NOT as a descendant of the
  // active keyWindow. scene.windows returns every UIWindow attached to
  // the scene including the status bar window, so walking each of those
  // with a small depth cap lands us on the label with a fraction of the
  // views visited and avoids racing against the home screen's layout
  // churn that was use-after-freeing descendants between ticks.
  function findStatusBarClockLabel(app, classes) {
    const cached = globalThis.__sbcust_statbar_label_cached;
    if (cached !== undefined && isNonZero(cached)) {
      log("statbar: cache HIT label=0x" + u64(cached).toString(16));
      return cached;
    }
    log("statbar: cache MISS - walking scene windows");

    const candidates = [];
    const visited = [0];
    const keyWin = objc(app, "keyWindow");
    log("statbar: keyWin=0x" + u64(keyWin).toString(16));
    if (!isNonZero(keyWin)) {
      log("statbar: no keyWindow - bailing");
      return 0n;
    }
    const scene = objc(keyWin, "windowScene");
    log("statbar: scene=0x" + u64(scene).toString(16));
    if (!isNonZero(scene)) {
      log("statbar: no windowScene - bailing");
      return 0n;
    }
    const sceneWins = objc(scene, "windows");
    if (!isNonZero(sceneWins)) {
      log("statbar: no scene.windows - bailing");
      return 0n;
    }
    const sceneWinCntRaw = objc(sceneWins, "count");
    const sceneWinCnt = Number(u64(sceneWinCntRaw));
    log("statbar: scene.windows count=" + sceneWinCnt);
    const sceneWinLim = sceneWinCnt < 16 ? sceneWinCnt : 16;
    for (let i = 0; i < sceneWinLim; i++) {
      const w = objc(sceneWins, "objectAtIndex:", BigInt(i));
      if (!isNonZero(w)) continue;
      const preCount = candidates.length;
      walkFindStatusBarLabels(w, classes.cls17, classes.cls16, candidates, 0, visited);
      log("statbar: window[" + i + "]=0x" + u64(w).toString(16) + " +" + (candidates.length - preCount) + " candidates");
    }
    log("statbar: walk total visited=" + visited[0] + " candidates=" + candidates.length);

    if (candidates.length === 0) return 0n;

    // Prefer a candidate whose current text has ':' (the clock line) so
    // we don't clobber the cellular / SSID labels. Cache the winner so
    // subsequent ticks don't need to walk.
    const colon = nsStr(":");
    for (let i = 0; i < candidates.length; i++) {
      const txt = objc(candidates[i], "text");
      if (!isNonZero(txt)) continue;
      const hit = objc(txt, "containsString:", colon);
      if (isNonZero(hit)) {
        log("statbar: picked candidate " + i + " (has ':' in current text)");
        globalThis.__sbcust_statbar_label_cached = candidates[i];
        return candidates[i];
      }
    }
    log("statbar: no ':' candidate, caching candidate 0");
    globalThis.__sbcust_statbar_label_cached = candidates[0];
    return candidates[0];
  }

  // Emulation of 34306/excalibur/darksword-kexploit-fun/StatusBarTweak.m
  // in JS against the lightsaber Native bridge.
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
  function createStatBarOverlay() {
    log("statbar: entry (replace mode v2)");
    log("statbar: pre objc_getClass UIApplication");
    const UIApplication = Native.callSymbol("objc_getClass", "UIApplication");
    log("statbar: UIApplication=0x" + u64(UIApplication).toString(16));
    if (!isNonZero(UIApplication)) { log("statbar: no UIApplication class"); return false; }
    log("statbar: pre sel sharedApplication");
    const sharedSel = sel("sharedApplication");
    log("statbar: sharedSel=0x" + u64(sharedSel).toString(16));
    log("statbar: pre objc_msgSend sharedApplication");
    const app = Native.callSymbol("objc_msgSend", UIApplication, sharedSel);
    log("statbar: app=0x" + u64(app).toString(16));
    if (!isNonZero(app)) { log("statbar: no sharedApplication"); return false; }

    log("statbar: pre resolveStatusBarClasses");
    const classes = resolveStatusBarClasses();
    if (!isNonZero(classes.cls17) && !isNonZero(classes.cls16)) {
      log("statbar: NEITHER STUIStatusBarStringView nor _UIStatusBarStringView");
      log("statbar: runtime - need a class-dump of UIKitCore on this build");
      return false;
    }

    log("statbar: pre findStatusBarClockLabel");
    const label = findStatusBarClockLabel(app, classes);
    if (!isNonZero(label)) { log("statbar: no status bar label instance found"); return false; }
    log("statbar: label=0x" + u64(label).toString(16));

    const text = buildStatBarText();
    log("statbar: text='" + text + "'");

    log("statbar: pre setText:");
    objc(label, "setText:", nsStr(text));
    log("statbar: post setText:");

    log("statbar: replace complete");
    return true;
  }

  function applyDockPatch(passTag) {
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

  try {
    log("=== sbcustomizer_light.js entry ===");
    Native.init();
    log("Native.init() ok, baseAddr=0x" + new BigUint64Array(nativeCallBuff)[20].toString(16));
    const bi = Native.bridgeInfo();
    globalThis.__sbcust_jsctx_obj = bi.jsContextObj;
    globalThis.__sbcust_apply_once = applyDockPatch;
    globalThis.__sbcust_log = log;
    globalThis.__sbcust_statbar_consecutive_failures = 0;
    globalThis.__sbcust_statbar = function() {
      if (!ENABLE_STATBAR) return;
      try {
        const ok = createStatBarOverlay();
        if (ok) {
          globalThis.__sbcust_statbar_consecutive_failures = 0;
        } else {
          globalThis.__sbcust_statbar_consecutive_failures++;
          if (globalThis.__sbcust_statbar_consecutive_failures >= 3) {
            log("statbar: 3 consecutive failures, halting loop to avoid crash churn");
            globalThis.__sbcust_statbar_loop_active = false;
          }
        }
      } catch (e) {
        log("statbar err: " + String(e));
        globalThis.__sbcust_statbar_consecutive_failures++;
        if (globalThis.__sbcust_statbar_consecutive_failures >= 3) {
          log("statbar: 3 consecutive failures, halting loop to avoid crash churn");
          globalThis.__sbcust_statbar_loop_active = false;
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

    log("about to runOnMainEvaluate (performSelectorOnMainThread) - PAC violation happens here if PAC context is stale");
    runOnMainEvaluate("try{__sbcust_log('main-thread dispatch alive');__sbcust_apply_once('main-pass-1');}catch(e){__sbcust_log('main-pass-1 err: '+e);}");
    // Bounce statbar through a separate performSelectorOnMainThread so it
    // lands on a fresh runloop tick rather than piggybacking on the dock
    // pass, which kicks off async UIKit layout work that can leave the
    // main thread in a funky state for an immediate follow-up message.
    runOnMainEvaluate("try{__sbcust_statbar();}catch(e){__sbcust_log('statbar dispatch err: '+e);}");
    log("runOnMainEvaluate returned (async dispatch, no crash on injected thread)");

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
    if (ENABLE_STATBAR) {
      globalThis.__sbcust_statbar_loop_active = true;
      log("statbar: entering repeat loop (interval=" + STATBAR_LOOP_INTERVAL_US + "us max=" + STATBAR_LOOP_MAX_ITERS + ")");
      let tick = 0;
      while (globalThis.__sbcust_statbar_loop_active && tick < STATBAR_LOOP_MAX_ITERS) {
        Native.callSymbol("usleep", BigInt(STATBAR_LOOP_INTERVAL_US));
        try {
          runOnMainEvaluate("try{__sbcust_statbar();}catch(e){__sbcust_log('statbar tick err: '+e);}");
        } catch (e) {
          log("statbar loop post err: " + String(e));
        }
        tick++;
      }
      log("statbar: loop exited after " + tick + " ticks (active=" + !!globalThis.__sbcust_statbar_loop_active + ")");
    }
  } catch (e) {
    log("fatal: " + String(e) + " stack: " + (e.stack || "N/A"));
  }
})();
