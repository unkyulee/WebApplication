// Base Electron modules
const { app, ipcMain, shell } = require('electron');
const window = require('./src/process/window');

if(process.platform == "darwin") {
	app.disableHardwareAcceleration()
}

// auto update
require('./src/process/update');

// hot reload
if (!app.isPackaged) {
	require('electron-reload')(__dirname, {
		// Note that the path to electron may vary according to the main file
		electron: require(`${__dirname}/node_modules/electron`),
	});
}

// Using singleInstanceLock for making app single instance
const singleInstanceLock = app.requestSingleInstanceLock();
// Checks for single instance lock
if (!singleInstanceLock) {
	// Quits the second instance
	app.quit();
} else {
	// Focus current instance
	app.on('second-instance', () => {});

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
	app.on('web-contents-created', (e, contents) => {
		// Check for a webview
		if (contents.getType() == 'webview') {
			// Listen for any new window events
			contents.on('new-window', (e, url) => {
				e.preventDefault();
				shell.openExternal(url);
			});
		}
	});
}
// Opens links in external browser
ipcMain.on('link-open', (sender, args) => {
	shell.openExternal(args);
});
