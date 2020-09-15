// auto update setup
const { ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

// main window
const mainWindow = require('./window');

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
	mainWindow.send('checking-for-update');
});

autoUpdater.on('update-not-available', () => {
	// send this information to the window
	console.log('update-not-available');
	mainWindow.send('update-not-available');
});

// update is available
autoUpdater.on('update-available', () => {
	// send this information to the window
	console.log('update-available');
	mainWindow.send('update-available');
});

autoUpdater.on('download-progress', (args) => {
	// send this information to the window
	console.log('download-progress', args);
	mainWindow.send('download-progress', args);
});

autoUpdater.on('update-downloaded', (args) => {
	console.log('update-downloaded');
	mainWindow.send('update-downloaded', args);
});

// restart app
ipcMain.on('install-update', () => {
	autoUpdater.quitAndInstall();
});
