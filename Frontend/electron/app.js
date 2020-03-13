// Base Electron modules
const { app, shell } = require('electron');
const window = require('./src/process/window');
// start up setting
const config = require('./service/config');
app.setLoginItemSettings({
  openAtLogin: config.get('module.desktop.openAtLogin', true),
  openAsHidden: config.get('module.desktop.openAsHidden', true)
})
// on mac hw acceleration flickers the angular screen
if(process.platform == 'darwin') app.disableHardwareAcceleration();
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
	app.on('second-instance', () => { });
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
		})
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

