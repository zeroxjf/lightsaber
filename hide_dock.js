// hide_dock.js
//
// Credits: MinePlayer16 for the original Hide Dock JavaScript tweak.
// Served by the Lightsaber repo for Cyanide's repo-tweak install flow.

(() => {
    log("JS Hiding Dock...");

    function isPtr(v) {
        return v !== 0 && v !== "0" && v !== "0x0" && v !== null && v !== undefined;
    }

    function canRespond(obj, sel) {
        if (!isPtr(obj)) return false;
        if (typeof r_responds !== "function") return true;
        return r_responds(obj, sel) != 0;
    }

    function call(obj, sel, a1, a2, a3, a4) {
        if (!isPtr(obj)) return 0;
        if (!canRespond(obj, sel)) return 0;
        return r_msg2(obj, sel, a1 || 0, a2 || 0, a3 || 0, a4 || 0);
    }

    function callMain(obj, sel, a1, a2, a3, a4) {
        if (!isPtr(obj)) return 0;
        if (!canRespond(obj, sel)) return 0;
        return r_msg2_main(obj, sel, a1 || 0, a2 || 0, a3 || 0, a4 || 0);
    }

    function callKnown(obj, sel, a1, a2, a3, a4) {
        if (!isPtr(obj)) return 0;
        return r_msg2(obj, sel, a1 || 0, a2 || 0, a3 || 0, a4 || 0);
    }

    function nsstr(s) {
        if (typeof r_nsstr !== "function") return 0;
        return r_nsstr(s);
    }

    function hasPrefix(nsString, prefix) {
        if (!isPtr(nsString)) return false;
        var prefixObj = nsstr(prefix);
        if (!isPtr(prefixObj)) return false;
        return call(nsString, "hasPrefix:", prefixObj) != 0;
    }

    var cachedIOS26OrNew = null;

    function isIOS26OrNew() {
        if (cachedIOS26OrNew !== null) return cachedIOS26OrNew;

        var deviceClass = r_class("UIDevice");
        var device = callKnown(deviceClass, "currentDevice");
        var version = callKnown(device, "systemVersion");

        // Keep this as an explicit 26+ gate: iOS 26 changed SpringBoardHome's
        // dock surface to the Liquid Glass SBDockView/SBFloatingDockView path.
        for (var major = 26; major <= 99; major++) {
            if (hasPrefix(version, String(major))) {
                cachedIOS26OrNew = true;
                return true;
            }
        }

        // If UIDevice probing is unavailable, fall back to classes observed in
        // the 26.0.1 SpringBoardHome dump provided with this fix.
        if (isPtr(r_class("SBHMultiplexingWrapperGlassBackgroundView")) ||
            isPtr(r_class("SBHomeScreenMaterialView"))) {
            cachedIOS26OrNew = true;
            return true;
        }
        cachedIOS26OrNew = false;
        return false;
    }

    function iconController() {
        var cls = r_class("SBIconController");
        if (!isPtr(cls)) return 0;
        return call(cls, "sharedInstance");
    }

    function iconManager() {
        var ctrl = iconController();
        return call(ctrl, "iconManager");
    }

    function hideView(view, label) {
        if (!isPtr(view)) return false;
        callMain(view, "setHidden:", 1);
        callMain(view, "setUserInteractionEnabled:", 0);
        callMain(view, "setNeedsLayout");
        log("Hide Dock: hid " + label + ".");
        return true;
    }

    function hideBackgroundOf(view, label) {
        if (!isPtr(view)) return false;
        var bg = callMain(view, "backgroundView");
        if (!isPtr(bg)) return false;
        return hideView(bg, label + ".backgroundView");
    }

    function hideIOS26DockPath() {
        var ok = false;
        var mgr = iconManager();
        if (!isPtr(mgr)) {
            log("Hide Dock iOS26+: SBHIconManager not found.");
            return false;
        }

        // iOS 26 phone path, from SpringBoardHome 26.0.1 class dump:
        // SBHIconManager.rootFolderController -> SBRootFolderView.dockView
        // -> SBDockView.backgroundView. This avoids relying on the dock list's
        // superview, which is no longer stable with the 26 Liquid Glass dock.
        var rootController = call(mgr, "rootFolderController");
        var rootView = callMain(rootController, "rootFolderView");
        if (!isPtr(rootView)) rootView = callMain(rootController, "rootFolderViewIfLoaded");

        var dockView = callMain(rootView, "dockView");
        if (hideBackgroundOf(dockView, "SBDockView")) ok = true;

        // iOS 26 iPad / floating dock path, from class dump:
        // SBHIconManager.floatingDockViewController -> dockView
        // -> SBFloatingDockView.mainPlatterView. Hide only the platter/shadow,
        // not the icon list views.
        var floatingController = call(mgr, "floatingDockViewController");
        var floatingDock = callMain(floatingController, "dockView");
        if (!isPtr(floatingDock)) floatingDock = callMain(floatingController, "dockViewIfExists");
        if (isPtr(floatingDock)) {
            var platter = callMain(floatingDock, "mainPlatterView");
            if (hideView(platter, "SBFloatingDockView.mainPlatterView")) ok = true;
            var shadow = callMain(platter, "shadowView");
            if (hideView(shadow, "SBFloatingDockPlatterView.shadowView")) ok = true;
            callMain(floatingDock, "setHasPlatterShadow:", 0);
        }

        if (!ok) log("Hide Dock iOS26+: no dock background view found.");
        return ok;
    }

    function hideLegacyDockPath() {
        var ctrl = iconController();
        if (!isPtr(ctrl)) {
            log("Hide Dock legacy: SBIconController not found.");
            return false;
        }

        var mgr = call(ctrl, "iconManager");
        var dockList = call(mgr, "dockListView");
        if (!isPtr(dockList)) dockList = call(ctrl, "dockListView");

        var dockView = callMain(dockList, "superview");
        if (!isPtr(dockView)) dockView = dockList;

        if (hideBackgroundOf(dockView, "legacy dock")) return true;

        log("Hide Dock legacy: backgroundView not found.");
        return false;
    }

    function applyHideDock(reason) {
        var useIOS26Path = isIOS26OrNew();
        log("Hide Dock: " + reason + " using " + (useIOS26Path ? "iOS 26+" : "pre-iOS 26") + " path.");

        var ok = useIOS26Path ? hideIOS26DockPath() : hideLegacyDockPath();
        if (!ok && useIOS26Path) {
            log("Hide Dock: iOS 26+ path missed; trying legacy fallback.");
            ok = hideLegacyDockPath();
        }

        log(ok ? "SUCCESS: Dock hidden." : "ERROR: Dock background not found.");
        return ok;
    }

    applyHideDock("initial");

    // SpringBoard can relayout/recreate the dock shortly after installation.
    // Retry a few times, then stop so a bad dock state cannot leave a runaway
    // JS loop alive in the tweak pipeline.
    var attempts = 0;
    var timer = setInterval(function () {
        attempts++;
        applyHideDock("retry " + attempts);
        if (attempts >= 6) clearInterval(timer);
    }, 750);
})();
