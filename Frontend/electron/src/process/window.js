const { app, BrowserWindow, nativeImage, Menu, dialog, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const url = require('url');
const path = require('path');

// services
const config = require('../service/config');

//
let mainWindow;

// redirect message
ipcMain.on("channel", (e, msg) => {
	mainWindow.webContents.send("channel", msg);
});

module.exports = {
	create: async function() {
		return new Promise(resolve => {
			// Building main menu from template
			const mainMenu = Menu.buildFromTemplate(this.createMenuTemplate());
			Menu.setApplicationMenu(mainMenu);

			// Load the previous state with fallback to defaults
			let mainWindowState = windowStateKeeper({
				defaultWidth: 800,
				defaultHeight: 600,
			});

			// create icon from the config
			let iconDataUri = config.get('module.desktop.icon');
			let icon = null;
			if (iconDataUri) icon = nativeImage.createFromDataURL(iconDataUri);

			// Create the window object
			mainWindow = new BrowserWindow({
				// Set main window title
				title: config.get('name', 'Loading ...'),
				// Enable frame if on macOS or if custom titlebar setting is disabled
				frame: false,
				// Show default title bar on macOS and hide it on others
				titleBarStyle: 'hidden',
				// Set main window icon
				icon,
				webPreferences: {
					// Enable <webview> tag for embedding WhatsApp
					webviewTag: true,
					// Enable nodeIntegration so window can use node functions
					nodeIntegration: true,
				},
				// Hides main window until it is ready to show
				show: false,
				x: mainWindowState.x,
				y: mainWindowState.y,
				width: mainWindowState.width,
				height: mainWindowState.height,
			});

			// Let us register listeners on the window, so we can update the state
			// automatically (the listeners will be removed when the window is closed)
			// and restore the maximized or full screen state
			mainWindowState.manage(mainWindow);

			// Shows window once ready
			mainWindow.once('ready-to-show', () => {
				mainWindow.show();
				resolve(mainWindow);
			});

			// Load the main window HTML file
			mainWindow.loadURL(
				url.format({
					pathname: path.join(__dirname, '../', 'window', 'index.html'),
					protocol: 'file:',
					slashes: true,
				})
			);

			// Main Window Closed Event
			mainWindow.on('closed', () => {
				app.quit();
			});
		});
	},
	createMenuTemplate: function() {
		let fileMenuTemplate;
		fileMenuTemplate = [
			{
				label: 'Force Reload',
				accelerator: 'CmdOrCtrl+Shift+R',
				click() {
					var window = BrowserWindow.getFocusedWindow();
					window.webContents.reload();
				},
			},
			{
				label: 'Reset App',
				click() {
					const dialogOptions = {
						type: 'info',
						buttons: ['OK', 'Cancel'],
						message: 'Are you sure to reset the app?',
					};
					dialog.showMessageBox(dialogOptions).then(result => {
						if (result.response == 0) {
							// reset config
							config.clear();

							// restart the app
							app.relaunch();
							app.exit(0);
						}
					});
				},
			},
			{
				type: 'separator',
			},
			{
				label: 'Check for updates',
				accelerator: 'CmdOrCtrl+Shift+U',
				click() {
					// check update
					const autoupdate = require('./update');
					autoupdate.check();
				},
			},
			{
				label: 'Quit',
				accelerator: 'CmdOrCtrl+Q',
				click() {
					app.quit();
				},
			},
		];

		// Checks if app is packaged or not
		//if (!app.isPackaged)
		{
			// Allows DevTools if app is not packaged
			fileMenuTemplate.unshift({
				label: 'Open DevTools',
				accelerator: 'CmdOrCtrl+Shift+I',
				click() {
					var window = BrowserWindow.getFocusedWindow();
					window.webContents.openDevTools();
				},
			});
		}

		// Create the main menu template
		return [
			{
				label: 'File',
				submenu: fileMenuTemplate,
			},
		];
	},
	send: function(name, event) {
		mainWindow.webContents.send(name, event);
	},
};
