// Base Electron modules
const { app, shell } = require("electron");
const window = require("./src/window");
const Store = require("electron-store");
const store = new Store();

// on mac hw acceleration flickers the angular screen
if (process.platform == "darwin") app.disableHardwareAcceleration();
process.on("exit", () => {
  app.quit();
});
// Using singleInstanceLock for making app single instance
var args = process.argv.slice(1),
  serve = args.some(function (val) {
    return val === "--serve";
  });
let singleInstanceLock = app.requestSingleInstanceLock();
// Checks for single instance lock
if (!singleInstanceLock && !serve) {
  console.log("App already running");
  // Quits the second instance
  app.exit(0);
} else {
  // auto update
  require("./src/update");

  // task runner
  let features = store.get("config.features");
  if (features && features.find((x) => x == "sync")) {
    console.log("scheduler starting");
    const cron = require("node-cron");
    const task = require("./src/task");

    cron.schedule("* * * * *", async () => {
      await task.run(
        store.get("config.host"),
        store.get("config._id"),
        store.get("local.token")
      );
    });
  }

  // Focus current instance
  app.on("second-instance", () => {
    // Checks if mainWindow object exists
    if (window.window) {
      // Checks if main window is minimized
      if (window.window.isMinimized()) {
        // Restores the main window
        window.window.restore();
      }
      // Focuses the main window
      window.window.focus();
    }
  });

  // create main window object
  app.on("ready", async () => {
    // open bootstrap window
    await window.create();
  });
  // Quits app if all windows are closed
  app.on("window-all-closed", () => {
    app.quit();
  });
  // Listen for web contents being created
  app.on("web-contents-created", (e, c) => {
    
    // resolve input focus loss in windows
    if (process.platform === "win32" && window.window) {
      let needsFocusFix = false;
      let triggeringProgrammaticBlur = false;

      window.window.on("blur", (event) => {
        if (!triggeringProgrammaticBlur) {
          needsFocusFix = true;          
        }
      });

      window.window.on("focus", (event) => {
        if (needsFocusFix) {
          needsFocusFix = false;
          triggeringProgrammaticBlur = true;
          setTimeout(function () {
            window.window.blur();
            window.window.focus();
            
            setTimeout(function () {
              triggeringProgrammaticBlur = false;
            }, 100);
          }, 100);
        }
      });    
    }

    // Import electron context menu library
    // Initialize the context menu
    require("electron-context-menu")({
      window: c,
      showCopyImage: true,
      showSaveImageAs: true,
    });

    // Check for a webview
    if (c.getType() == "webview") {
      // Listen for any new window events
      c.on("new-window", (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
      });
    }
  });
}
