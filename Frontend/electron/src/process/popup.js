const { app, BrowserWindow } = require('electron');
const obj = require('object-path');

// main window
const mainWindow = require('./window');

module.exports = {
	window: null,
	create: async function(option) {
		return new Promise(resolve => {
			// Create the window object
			this.window = new BrowserWindow({
				// create as a child window
				parent: mainWindow.window,
				// Set main window title
				title: obj.get(option, 'title', ''),
				// Enable frame if on macOS or if custom titlebar setting is disabled
				frame: process.platform === 'darwin' ? true : obj.get(option, 'frame', true),
				// Show default title bar on macOS and hide it on others
				titleBarStyle: process.platform === 'darwin' ? 'default' : obj.get(option, 'titleBarStyle', 'default'),
				webPreferences: {
					// Enable <webview> tag for embedding WhatsApp
					webviewTag: true,
					// Enable nodeIntegration so window can use node functions
					nodeIntegration: true,
				},
				// Hides main window until it is ready to show
				show: obj.get(option, 'show', false),
				width: obj.get(option, 'width', 400),
				height: obj.get(option, 'height', 600),
			});

			// remove menu
			if (app.isPackaged) {
				this.window.removeMenu();
			}

			// Shows window once ready
			this.window.once('ready-to-show', () => {
				resolve(this.window);
			});

			this.window.webContents.on('did-finish-load', e => {
				e.sender.executeJavaScript(`window.electron = true;`)
			});

			// hide window instead of closing
			this.window.on('close', event => {
				event.preventDefault();
				this.window.hide();
			});

			// Load the main window HTML file
			this.window.loadURL(obj.get(option, 'url', '_blank'));
		});
	},
	show: function() {
		this.window.show();
	},
	hide: function() {
		this.window.hide();
	},
};
