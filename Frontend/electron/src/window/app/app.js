Vue.use(VueMaterial.default);

// services
const rest = require('../service/rest');
const auth = require('../service/auth');
const permission = require('../service/permission');

// layouts
require('./app/layout/service-url.js');
require('./app/layout/login.js');
require('./app/layout/navigation');
require('./app/layout/composer');
require('./app/layout/auto-update');
require('./app/layout/offline');

// channel redirects the message to the webviews
ipcRenderer.on('channel', (sender, $event) => {
	// redirect all IPC messages to webviews
	if (!$event.to) {
		event.send($event.channel, $event.data);
	} else {
		let webView = document.getElementById($event.to);
		let webContentsId = webView.getWebContentsId();
		const { webContents } = require('electron').remote;
		let content = webContents.fromId(webContentsId);

		if (webView) {
			switch ($event.name) {
				case 'script':
					{
						try {
							eval($event.script);
						} catch (ex) {
							console.error(ex);
						}
					}
					break;

				case 'src':
					webView.src = $event.src;
					break;

				case 'print':
					{
						(async () => {
							await content.print($event.option, (success, reason) => {
								console.log(success, reason);
							});
						})();
					}

					break;

				default:
					webView.send($event.channel, $event.data);
					break;
			}
		}
	}
});

new Vue({
	el: '#app',
	template: `
	<div v-bind:style="style">
		<template v-if="!online">
			<offline />
		</template>
		<template v-if="online">
			<auto-update />
			<template v-if="!registered">
				<service-url />
			</template>
			<template v-if="registered">
				<login v-if="authenticated == false"></login>
				<navigation v-if="authenticated == true" />
				<composer v-if="authenticated == true" />
			</template>
		</template>

	</div>
  `,
	mounted: async function () {
		// check online
		this.online = navigator.onLine;

		// check registration
		this.registered = this.checkRegistered();

		// listen to login-success and logout event
		event.subscribe('index', 'login-success', async () => {
			// check if authenticated
			this.authenticated = true;

			setTimeout(async () => {
				// download config
				await this.downloadConfig();
			});
		});
		event.subscribe('index', 'logout', async () => {
			// check if authenticated
			this.authenticated = false;
		});
		if (this.registered) {
			// download index.js
			await this.downloadIndexJS();
			// check if authenticated
			this.authenticated = await auth.isAuthenticated();
		}
	},
	destroyed: function () {
		// stop listen to drawer-toggle event
		event.unsubscribe_all('index');
	},
	data: function () {
		return {
			style: {
				width: '100%',
				height: '100%',
				border: '1px solid rgba(#000, .12)',
				display: 'flex',
				flexDirection: 'row',
			},
			registered: false,
			authenticated: null,
			menuVisible: false,
			online: true,
		};
	},
	methods: {
		toggleMenu() {
			this.menuVisible = !this.menuVisible;
		},
		checkRegistered() {
			let registered = false;

			// check if service url exists
			// check if the token exists
			if (config.get('service_url')) {
				registered = true;
			}

			return registered;
		},
		async downloadIndexJS() {
			let service_url = config.get('service_url');
			if (service_url) {
				let response = await rest.request(`${config.get('service_url')}/index.js`);
				eval(response.data);
				config.set(window.__CONFIG__);
			}
		},
		async downloadConfig() {
			// download electron configuration
			let r = await rest.request(`${config.get('service_url')}/navigation.config`);
			r = r.data;

			// save theme
			config.set('theme', r.theme);

			// save permission
			config.set('permissions', r.permissions);

			// save module config
			config.set('module', r.module);

			// save navigation
			for (let nav of r.nav) {
				// assign default viewport
				if (!nav.viewport) nav.viewport = 'default';
				// add http...
				if (nav.url && !nav.url.startsWith('http')) {
					nav.url = `${config.get('service_url')}${nav.url}`;
				}

				if (nav.children) {
					for (let child of nav.children) {
						// add http...
						if (child.url && !child.url.startsWith('http')) {
							child.url = `${config.get('service_url')}${child.url}`;
						}
					}
				}
			}
			config.set('nav', r.nav);

			// check desktop permission exists
			if (!permission.permitted(['desktop.enabled'])) {
				auth.logout();
			} else {
				// update navigation
				event.send('navigation-updated');
			}
		},
	},
});
