// Base Electron modules
const { app, shell } = require('electron');
const window = require('./src/process/window');
// start up setting
const config = require('./src/service/config');
app.setLoginItemSettings({ openAtLogin: false });
if (app.isPackaged) {
	app.setLoginItemSettings({
		openAtLogin: config.get('module.desktop.openAtLogin', true),
	});
}
// on mac hw acceleration flickers the angular screen
if (process.platform == 'darwin') app.disableHardwareAcceleration();
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
