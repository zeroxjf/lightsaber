// hide_dock.js
//
// Credits: MinePlayer16 for the original Hide Dock JavaScript tweak.
// Served by the Lightsaber repo for Cyanide's repo-tweak install flow.

log("JS Hiding Dock...");

var cls = r_class("SBIconController");
if (cls != 0) {
    var ctrl = r_msg2(cls, "sharedInstance");
    var mgr = r_msg2(ctrl, "iconManager");
    var dockList = r_msg2(mgr, "dockListView");
    
    if (dockList == 0) {
        dockList = r_msg2(ctrl, "dockListView");
    }
    
    var dockView = r_msg2(dockList, "superview");
    if (dockView == 0) {
        dockView = dockList;
    }

    var bgView = r_msg2(dockView, "backgroundView");
    if (bgView != 0) {
        r_msg2_main(bgView, "setHidden:", 1);
        log("SUCCESS: Dock hidden.");
    } else {
        log("ERROR: backgroundView not found.");
    }
} else {
    log("ERROR: SBIconController not found.");
}
