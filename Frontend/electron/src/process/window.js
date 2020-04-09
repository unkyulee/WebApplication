const { app, BrowserWindow, nativeImage, Menu, dialog, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const url = require('url');
const path = require('path');
// services
const config = require('../service/config');

module.exports = {
	window: null,
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
			this.window = new BrowserWindow({
				// Set main window title
				title: config.get('name', 'Loading ...'),
				// Enable frame if on macOS or if custom titlebar setting is disabled
				frame: process.platform !== 'darwin' ? false : true,
				// Show default title bar on macOS and hide it on others
				titleBarStyle: process.platform !== 'darwin' ? 'hidden' : 'default',
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
			mainWindowState.manage(this.window);

			// redirect message
			ipcMain.on('channel', (e, msg) => {
				this.window.webContents.send('channel', msg);
			});

			// create popup window
			ipcMain.on('popup', async (e, option) => {
				await popup.create(option);
			});

			ipcMain.on('popup-show', (e, option) => {
				popup.show();
			});
			ipcMain.on('popup-hide', (e, option) => {
				popup.hide();
			});

			// Main Window Closed Event
			this.window.on('close', () => {
				popup.exit();
				app.quit();
			});

			// Shows window once ready
			this.window.once('ready-to-show', async () => {
				this.window.show();
				resolve(this.window);
			});

			// Load the main window HTML file
			this.window.loadURL(
				url.format({
					pathname: path.join(__dirname, '../', 'window', 'index.html'),
					protocol: 'file:',
					slashes: true,
				})
			);
		});
	},

	send: function(name, event) {
		this.window.webContents.send(name, event);
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
				label: 'Open DevTools',
				accelerator: 'CmdOrCtrl+Shift+I',
				click() {
					var window = BrowserWindow.getFocusedWindow();
					window.webContents.openDevTools();
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
					const { autoUpdater } = require('electron-updater');
					autoUpdater.checkForUpdatesAndNotify();
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
				label: 'Quit',
				accelerator: 'CmdOrCtrl+Q',
				click() {
					app.quit();
				},
			},
		];

		// Create the main menu template
		return [
			{
				label: 'Menu',
				submenu: fileMenuTemplate,
			},
		];
	},
};
