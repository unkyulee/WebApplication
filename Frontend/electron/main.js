// Base Electron modules
const { app, shell } = require('electron');
const window = require('./src/window');
const config = require('./src/config');

// on mac hw acceleration flickers the angular screen
if (process.platform == 'darwin') app.disableHardwareAcceleration();

// Using singleInstanceLock for making app single instance
var args = process.argv.slice(1),
	serve = args.some(function (val) {
		return val === '--serve';
	});
let singleInstanceLock = app.requestSingleInstanceLock();
// Checks for single instance lock
if (!singleInstanceLock && !serve) {
	console.log('App already running');
	// Quits the second instance
	app.exit(0);
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

/*
// auto update
require('./app/electron/update');
*/
