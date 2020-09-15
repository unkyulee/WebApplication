const remote = require('electron').remote;
const obj = require('object-path');

// services
const config = require('../../../service/config');
const rest = require('../../../service/rest');

Vue.component('ServiceUrl', {
	template: `
  <div v-bind:style="style">
    <h1>Registration</h1>
		<md-divider></md-divider>
		<p style="font-size: large">
			Inserisci l'URL del servizio fornito da YesBut.
			Se non si dispone delle informazioni, si prega di richiedere YesBut per l'accesso.
		</p>
    <md-field>
      <label>Service URL</label>
      <md-input v-model="service_url" @keyup="keyup"></md-input>
		</md-field>
		<pre v-if="error" style="color: crimson; font-weight: bold;">{{error}}</pre>
    <md-button class="md-raised md-primary" v-on:click="registerServiceURL">Register Service URL</md-button>
  </div>`,
	data: function () {
		return {
			style: {
				width: '100%',
				height: '100%',
				padding: '24px',
			},
			service_url: null,
			error: ''
		};
	},
	methods: {
		async registerServiceURL($event) {
			if (this.service_url) {
				this.service_url = this.service_url.trim();

				// check if the service url is valid
				try {
					let response = await rest.request(`${this.service_url}/index.js`);
					if(response.status == 200) {
						config.set('service_url', this.service_url);
						remote.app.relaunch();
						remote.app.exit(0);
					}
				} catch(ex) {
					let message = `${ex.message}\n${obj.get(ex, 'config.url')}`
					console.log(message)
					this.error = message;
				}
			} else {
				this.error = "Service URL is empty"
			}
		},
		async keyup(e) {
			console.log(e)
			// when pressing enter press the submit button
			if (e.keyCode == 13) {
				await this.registerServiceURL(null);
			}
		},
	},
});
