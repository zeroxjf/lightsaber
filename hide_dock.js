// hide_dock.js
//
// Credits: MinePlayer16 for the original Hide Dock JavaScript tweak.
// Served by the Lightsaber repo for Cyanide's repo-tweak install flow.

(() => {
    var HIDE_DOCK_VERSION = "1.0.3";
    log("JS Hiding Dock v" + HIDE_DOCK_VERSION + "...");

    function isPtr(v) {
        if (v === null || v === undefined) return false;
        if (typeof v === "string") return v !== "0" && v !== "0x0" && v !== "";
        return v !== 0;
    }

    function msg(obj, sel, a1, a2, a3, a4) {
        if (!isPtr(obj)) return 0;
        return r_msg2(obj, sel, a1 || 0, a2 || 0, a3 || 0, a4 || 0);
    }

    function msgMain(obj, sel, a1, a2, a3, a4) {
        if (!isPtr(obj)) return 0;
        return r_msg2_main(obj, sel, a1 || 0, a2 || 0, a3 || 0, a4 || 0);
    }

    function responds(obj, sel) {
        if (!isPtr(obj)) return false;
        if (typeof r_responds !== "function") return true;
        return r_responds(obj, sel) != 0;
    }

    function hideView(view, label) {
        if (!isPtr(view)) return false;
        msgMain(view, "setHidden:", 1);
        msgMain(view, "setNeedsLayout");
        log("Hide Dock: hid " + label + ".");
        return true;
    }

    function iconManager() {
        var iconControllerClass = r_class("SBIconController");
        var iconController = msg(iconControllerClass, "sharedInstance");
        return msg(iconController, "iconManager");
    }

    function isIOS26OrNewPath() {
        // iOS 26 SpringBoardHome has these Liquid Glass home-screen classes in
        // the supplied 26.0.1 class dump. Avoid UIDevice/NSString probing here:
        // this is just a safe branch selector for the dock implementation.
        return isPtr(r_class("SBHomeScreenMaterialView")) ||
               isPtr(r_class("SBHMultiplexingWrapperGlassBackgroundView"));
    }

    function hideIOS26OrNewDock() {
        var mgr = iconManager();
        if (!isPtr(mgr)) {
            log("Hide Dock iOS 26+: icon manager unavailable.");
            return false;
        }

        var ok = false;

        // iOS 26 phone path, from SpringBoardHome 26.0.1 class dump:
        // SBHIconManager.rootFolderController -> SBRootFolderView.dockView
        // -> SBDockView.backgroundView.
        var rootController = msg(mgr, "rootFolderController");
        var rootView = msgMain(rootController, "rootFolderView");
        if (!isPtr(rootView)) rootView = msgMain(rootController, "rootFolderViewIfLoaded");
        var dockView = msgMain(rootView, "dockView");
        var dockBackground = msgMain(dockView, "backgroundView");
        if (hideView(dockBackground, "SBDockView.backgroundView")) ok = true;

        // iPad/floating dock path, also from the 26.0.1 class dump:
        // SBHIconManager.floatingDockViewController -> SBFloatingDockView
        // -> SBFloatingDockPlatterView. Phone devices usually just return nil.
        var floatingController = msg(mgr, "floatingDockViewController");
        var floatingDock = msgMain(floatingController, "dockView");
        var platter = msgMain(floatingDock, "mainPlatterView");
        if (hideView(platter, "SBFloatingDockView.mainPlatterView")) ok = true;
        var shadow = msgMain(platter, "shadowView");
        if (hideView(shadow, "SBFloatingDockPlatterView.shadowView")) ok = true;

        if (!ok) log("Hide Dock iOS 26+: no dock background/platter found.");
        return ok;
    }

    function hidePreIOS26Dock() {
        var iconControllerClass = r_class("SBIconController");
        var ctrl = msg(iconControllerClass, "sharedInstance");
        if (!isPtr(ctrl)) {
            log("Hide Dock pre-iOS 26: SBIconController unavailable.");
            return false;
        }

        var mgr = msg(ctrl, "iconManager");
        var dockList = msg(mgr, "dockListView");
        if (!isPtr(dockList)) dockList = msg(ctrl, "dockListView");

        var dockView = msgMain(dockList, "superview");
        if (!isPtr(dockView)) dockView = dockList;

        // This guard is what the original script lacked. Without it, iOS 26
        // could send -backgroundView to a plain UIView and abort SpringBoard.
        // This function is only called for the pre-26 branch.
        if (!responds(dockView, "backgroundView")) {
            log("Hide Dock pre-iOS 26: dock view has no backgroundView selector.");
            return false;
        }

        var bgView = msgMain(dockView, "backgroundView");
        if (hideView(bgView, "legacy dock.backgroundView")) return true;

        log("Hide Dock pre-iOS 26: backgroundView returned nil.");
        return false;
    }

    var ok = false;
    if (isIOS26OrNewPath()) {
        log("Hide Dock: using iOS 26+ path.");
        ok = hideIOS26OrNewDock();
    } else {
        log("Hide Dock: using pre-iOS 26 path.");
        ok = hidePreIOS26Dock();
    }

    log(ok ? "SUCCESS: Dock hidden." : "ERROR: Dock background not found.");
})();
