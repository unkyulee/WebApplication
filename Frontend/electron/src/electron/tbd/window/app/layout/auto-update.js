const { ipcRenderer } = require('electron');

Vue.component('AutoUpdate', {
	template: `
  <div v-bind:style="style" v-if="show">
    <span>{{message}}</span>
    <md-progress-bar :md-mode="mode" :md-value="progress"></md-progress-bar>
  </div>`,
	mounted: async function() {
		ipcRenderer.on('checking-for-update', () => {
			this.message = 'Checking for update ...';
			this.show = true;
			setTimeout(() => this.show = false, 15000);
			this.mode = 'indeterminate';
		});

		ipcRenderer.on('update-not-available', () => {
			console.log('update-not-available');
			// send this information to the window
			this.show = false;
		});

		// update is available
		ipcRenderer.on('update-available', () => {
			console.log('update-available');
      this.message = 'Preparing to download ...';
			this.show = true;
			setTimeout(() => this.show = false, 5000);
			this.mode = 'indeterminate';
		});

		ipcRenderer.on('download-progress', (sender, args) => {
			console.log('download', args);
			// send this information to the window
			this.message = 'Downloading update ...';
			this.show = true;
			this.progress = args.percent;
			this.mode = 'determinate';
		});

		ipcRenderer.on('update-downloaded', (sender, args) => {
			console.log('update-downloaded', args);
			this.message = 'Update Ready. Please, restart the app.';
			this.show = true;
			this.progress = 100;
			this.mode = 'determinate';
		});

		// initiate update-check
		setTimeout(() => ipcRenderer.send('update-check'), 30 * 1000);
		setInterval(() => ipcRenderer.send('update-check'), 4 * 60 * 60 * 1000);
	},
	destroyed: async function() {},
	data: function() {
		return {
			show: false,
			style: {
				padding: '12px',
				position: 'absolute',
				zIndex: 1000,
				background: 'white',
				width: '300px',
				bottom: '24px',
				right: '24px',
				boxShadow: '1px 0 15px rgba(0, 0, 0, 0.07)',
			},
			message: 'Checking for update ...',
			mode: 'indeterminate',
			progress: 0,
		};
	},
});
