"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win = null;
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            enableRemoteModule: false // true if you want to use remote module in renderer context (ie. Angular)
        },
    });
    if (serve) {
        win.webContents.openDevTools();
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/../../node_modules/electron")
        });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    return win;
}
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', function () { return setTimeout(createWindow, 400); });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
/*
// Base Electron modules
const { app, shell } = require('electron');
const window = require('./app/electron/window');
// start up setting
const config = require('./app/electron/config');
app.setLoginItemSettings({ openAtLogin: false });

if (app.isPackaged) {
    app.setLoginItemSettings({
        openAtLogin: config.get('module.desktop.openAtLogin', true),
    });
}

// on mac hw acceleration flickers the angular screen
if (process.platform == 'darwin') app.disableHardwareAcceleration();
// auto update
require('./app/electron/update');
// hot reload
if (!app.isPackaged) {
    require('electron-reload')(__dirname, {
        // Note that the path to electron may vary according to the main file
        electron: require(`${__dirname}/../node_modules/electron`),
    });
}

// Using singleInstanceLock for making app single instance
let singleInstanceLock = app.requestSingleInstanceLock();
singleInstanceLock = true;
// Checks for single instance lock
if (!singleInstanceLock) {
    console.log('App already running');
    // Quits the second instance
    app.exit(0);
    console.log('Exit');
} else {
    // Focus current instance
    app.on('second-instance', () => {
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
    app.on('ready', async () => {
        // open bootstrap window
        await window.create();
    });
    // Quits app if all windows are closed
    app.on('window-all-closed', () => {
        app.quit();
    });
    // Listen for web contents being created
    app.on('web-contents-created', (e, c) => {
        // Import electron context menu library
        // Initialize the context menu
        require('electron-context-menu')({
            window: c,
            showCopyImage: true,
            showSaveImageAs: true,
        });

        // Check for a webview
        if (c.getType() == 'webview') {
            // Listen for any new window events
            c.on('new-window', (e, url) => {
                e.preventDefault();
                shell.openExternal(url);
            });
        }
    });
}
*/ 
//# sourceMappingURL=main.js.map