// auto update setup
const { ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

// window
const window = require('./window');

// check update
ipcMain.on('update-check', () => {
	// check update
	try {
		console.log('initiate update check')
		autoUpdater.checkForUpdatesAndNotify();
	} catch(ex) {
		console.error(ex)
	}
});

//
autoUpdater.on('checking-for-update', () => {
	// send this information to the window
	console.log('checking-for-update');
	window.send('checking-for-update');
});

autoUpdater.on('update-not-available', () => {
	// send this information to the window
	console.log('update-not-available');
	window.send('update-not-available');
});

// update is available
autoUpdater.on('update-available', () => {
	// send this information to the window
	console.log('update-available');
	window.send('update-available');
});

autoUpdater.on('download-progress', (args) => {
	// send this information to the window
	console.log('download-progress', args);
	window.send('download-progress', args);
});

autoUpdater.on('update-downloaded', (args) => {
	console.log('update-downloaded');
	window.send('update-downloaded', args);
});

// restart app
ipcMain.on('install-update', () => {
	autoUpdater.quitAndInstall();
});
