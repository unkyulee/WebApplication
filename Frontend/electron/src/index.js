if (window.process && window.process.type) {
	console.log('start');
	const Store = require('electron-store');
	window.store = new Store();
	console.log(window.store);

	// load global config
	window.__CONFIG__ = window.store.get('config');

	// replace localStorage
	localStorage.getItem = (key) => {
		key = key.replace(/\./g, '_');
		return window.store.get(`local.${key}`);
	};
	localStorage.setItem = (key, value) => {
		key = key.replace(/\./g, '_');
		window.store.set(`local.${key}`, value);
	};
	localStorage.removeItem = (key) => {
		key = key.replace(/\./g, '_');
		window.store.delete(`local.${key}`);
	};
	localStorage.clear = () => {
		// clear the previous config
		window.store.delete('local');
	};
	console.log('localStorage');

	let timeout = (ms) => new Promise((res) => setTimeout(res, ms));
	(async () => {
		// wait until angular loads for 100s
		console.log('waiting for app to load');
		for (let i = 0; i < 100; i++) {
			await timeout(1000);
			if (document.querySelector('layout')) break;
		}
		console.log('app loaded');

		// check if the config is from the old version
		if (window.store.get('token')) {
			window.store.clear();
		}

		// check if the service_url is registered
		let service_url = window.store.get('service_url');
		console.log(`service url: ${service_url}`)
		if (!service_url) {
			// set market on the global
			window.__CONFIG__.requires_service_url = true;
			// send refresh
			window.__CONFIG__.event.send({ name: 'changed' });
		} else {
			window.loadConfig(service_url);
		}
	})();
}

window.loadConfig = (service_url) => {
	console.log(`loadConfig ${service_url}`)
	const axios = require('axios');

	axios
		.get(`${service_url}/index.js`)
		.then((r) => {
			console.log(`config loaded`, r)
			// load new config
			r.data = r.data.replace('window.__CONFIG__', 'window.__CONFIG__NEW__');
			eval(r.data);
			delete window.__CONFIG__NEW__.module;

			// restore old config
			window.__CONFIG__ = Object.assign({}, window.__CONFIG__, window.__CONFIG__NEW__);

			// if electron
			// save to the persist config
			window.store.set('config', window.__CONFIG__NEW__);
			window.store.delete('local');

			// delete temp variable
			delete window.__CONFIG__NEW__;
			delete __CONFIG__.requires_service_url;

			// if event exists load the login screen
			window.__CONFIG__.event.send({ name: 'load' });
		})
		.catch(() => {
			// if event exists load the login screen
			window.__CONFIG__.event.send({ name: 'login-success' });
			window.__CONFIG__.event.send({ name: 'changed' });
		});
};

window.registerService = (service_url) => {
	if (service_url) {
		window.store.clear({});
		window.store.set('service_url', service_url);
	}
};

window.reload = () => {
	const { app } = require('electron').remote;
	app.relaunch();
	app.quit();
};

// handle events
const { ipcRenderer } = require('electron');
ipcRenderer.on('channel', (sender, $event) => {
	if ($event.data) {
		window.__CONFIG__.event.send($event.data);
		window.__CONFIG__.event.send({ name: 'changed' });
	}
});
