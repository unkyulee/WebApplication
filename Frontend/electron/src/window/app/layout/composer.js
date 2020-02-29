const config = require('../../../service/config');
const event = require('../../../service/event');

// event handler
ipcRenderer.on('channel', (sender, event) => {
	// redirect all IPC messages to webviews
	let webView = document.getElementById(event.to);
	if (webView) {
		webView.send(event.channel, event.data);
	}
});

Vue.component('Composer', {
	template: `
	<div :style="style">
		<div v-for="(screen, index) in screens" :style="screen.style">
			<webview
				v-if="!screen.type"
				:key="index"
				:id="screen.viewport"
				:src="screen.url"
				:useragent="screen.useragent"
				:partition="screen.partition"
				:style="screen.style"
				preload="./app/ui/webview_preload.js">
			</webview>
		</div>
	</div>
	`,
	mounted: async function() {
		// listen to navigation-updated
		event.subscribe('composer', 'navigation-updated', async () => {
			// copy screens
			let navs = config.get('nav');
			// make all hidden
			let viewport = {};
			for (let nav of navs) {
				// loop through navs and group by viewport
				if (!nav.viewport) nav.viewport = 'default';
				if (!viewport[nav.viewport]) viewport[nav.viewport] = nav;
			}

			// create screens as many numbers of viewport
			let screens = [];
			for (let vp of Object.keys(viewport)) {
				// convert url with host
				if (viewport[vp].url && !viewport[vp].url.startsWith('http')) {
					viewport[vp].url = `${config.get('service_url')}${vp.url}`;
				}
				screens.push({
					viewport: vp,
					useragent: viewport[vp].useragent,
					partition: viewport[vp].partition,
					style: this.hidden,
					url: viewport[vp].url
				});
			}
			// set
			this.screens = screens;
		});

		// listen to nav-selected
		event.subscribe('composer', 'nav-selected', nav => {
			if (!nav.viewport) nav.viewport = 'default';
			// hide all the screen
			for (let screen of this.screens) {
				// show the selected screen
				if (screen.viewport == nav.viewport) {
					// convert url with host
					if (nav.url && !nav.url.startsWith('http')) {
						screen.url = `${config.get('service_url')}${nav.url}`;
					} else {
						screen.url = nav.url;
					}
					screen.style = this.show;
				}
				// hide other screens
				else screen.style = this.hide;
			}
		});
	},
	destroyed: function() {
		// stop listen to drawer-toggle event
		event.unsubscribe_all('composer');
	},
	data: function() {
		return {
			style: {
				width: '100%',
				height: '100%',
				overflowY: 'hidden',
			},
			hide: {
				visibility: 'hidden',
				width: 0,
				height: 0,
			},
			show: {
				width: '100%',
				height: '100%',
			},
			screens: [],
		};
	},
});
