const remote = require('electron').remote;

// services
const config = require('../../../service/config');

Vue.component('ServiceUrl', {
	template: `
  <div v-bind:style="style">
    <h1>Registration</h1>
    <md-divider></md-divider>
    <md-field>
      <label>Service URL</label>
      <md-input v-model="service_url"></md-input>
    </md-field>
    <md-button class="md-raised md-primary" v-on:click="registerServiceURL">Register Service URL</md-button>
  </div>`,
	data: function() {
		return {
			style: {
				padding: '24px',
			},
			service_url: null,
		};
	},
	methods: {
		registerServiceURL($event) {
			config.set('service_url', this.service_url);
			remote.app.relaunch();
			remote.app.exit(0);
		},
	},
});
