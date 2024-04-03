const {
  app,
  BrowserWindow,
  nativeImage,
  Menu,
  dialog,
  ipcMain,
  session,
} = require("electron");
const windowStateKeeper = require("electron-window-state");
const url = require("url");
const path = require("path");
// services
const config = require("./config");

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

module.exports = {
  window: null,
  create: async function () {
    return new Promise((resolve) => {
      // Load the previous state with fallback to defaults
      let mainWindowState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600,
      });

      // create icon from the config
      let iconDataUri = config.get("module.desktop.icon");
      let icon = null;
      if (iconDataUri) icon = nativeImage.createFromDataURL(iconDataUri);

      // Create the window object
      this.window = new BrowserWindow({
        // Set main window title
        title: config.get("name", "Loading ..."),
        // Enable frame if on macOS or if custom titlebar setting is disabled
        // frame: process.platform !== 'darwin' ? false : true,
        // Show default title bar on macOS and hide it on others
        //titleBarStyle: process.platform !== 'darwin' ? 'hidden' : 'default',
        // Set main window icon
        icon,
        webPreferences: {
          // Enable <webview> tag for embedding
          webviewTag: true,
          // Enable nodeIntegration so window can use node functions
          nodeIntegration: true,
          webSecurity: false,
          enableRemoteModule: true,
          contextIsolation: false,
        },
        // Hides main window until it is ready to show
        show: false,
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
      });

      // remove menu
      this.window.removeMenu();

      // Let us register listeners on the window, so we can update the state
      // automatically (the listeners will be removed when the window is closed)
      // and restore the maximized or full screen state
      mainWindowState.manage(this.window);

      // redirect message
      ipcMain.on("channel", (e, msg) => {
        this.window.webContents.send("channel", msg);
      });

      ipcMain.on("focus", (e, msg) => {
        this.window.focus();
      });

      // Main Window Closed Event
      this.window.on("close", () => {
        app.quit();
      });

      // Shows window once ready
      this.window.once("ready-to-show", async () => {
        this.window.show();
        resolve(this.window);
      });

      // Load the main window HTML file
      var args = process.argv.slice(1),
        serve = args.some(function (val) {
          return val === "--serve";
        });
      if (serve) {
        this.window.webContents.openDevTools();
      }

      //
      let debug = false;
      //this.window.webContents.openDevTools();
      session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = userAgent;
        callback({ cancel: false, requestHeaders: details.requestHeaders });
      });


      if (debug) {
        this.window.loadURL("http://localhost:4200");
      } else {
        this.window.loadURL(
          url.format({
            pathname: path.join(__dirname, "../wwwroot", "index.html"),
            protocol: "file:",
            slashes: true,
          })
        );
      }
    });
  },

  send: function (name, event) {
    this.window.webContents.send(name, event);
  },
};
