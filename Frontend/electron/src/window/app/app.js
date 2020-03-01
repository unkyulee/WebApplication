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

// channel redirects the message to the webviews
ipcRenderer.on('channel', (sender, $event) => {
	// redirect all IPC messages to webviews
	let webView = document.getElementById($event.to);
	if ($event.to == '') {
		event.send($event.channel, $event.data);
	} else if (webView) {
		webView.send($event.channel, $event.data);
	}
});

new Vue({
	el: '#app',
	template: `
	<div v-bind:style="style">
		<auto-update />
    <template v-if="!registered">
      <service-url />
    </template>
    <template v-if="registered">
      <login v-if="authenticated == false"></login>
			<navigation v-if="authenticated == true" />
			<composer v-if="authenticated == true" />
    </template>
	</div>
  `,
	mounted: async function() {
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
	destroyed: function() {
		// stop listen to drawer-toggle event
		event.unsubscribe_all('index');
	},
	data: function() {
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
		};
	},
	methods: {
		toggleMenu() {
			this.menuVisible = !this.menuVisible;
		},
		checkRegistered() {
			return !!config.get('service_url');
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
				if (nav.url && !nav.url.startsWith('http')) nav.url = `${config.get('service_url')}${nav.url}`;
			}
			config.set('nav', r.nav);

			// check desktop permission exists
			if (!permission.permitted(['desktop.enabled'])) {
				auth.logout();
			} else {
				event.send('navigation-updated');
			}
		},
	},
});
