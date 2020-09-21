// auto update setup
const { autoUpdater } = require('electron-updater');

// check update
try {
	console.log('initiate update check')
	autoUpdater.checkForUpdatesAndNotify();
} catch(ex) {
	console.error(ex)
}

//
autoUpdater.on('checking-for-update', () => {
	// send this information to the window
	console.log('checking-for-update');
});

autoUpdater.on('update-not-available', () => {
	// send this information to the window
	console.log('update-not-available');
});

// update is available
autoUpdater.on('update-available', () => {
	// send this information to the window
	console.log('update-available');
});

autoUpdater.on('download-progress', (args) => {
	// send this information to the window
	console.log('download-progress', args);
});

autoUpdater.on('update-downloaded', (args) => {
	console.log('update-downloaded');
	setImmediate(() => {
		autoUpdater.quitAndInstall();
	})
});
