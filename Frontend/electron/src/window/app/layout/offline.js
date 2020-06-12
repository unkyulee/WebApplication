const remote = require('electron').remote;
const obj = require('object-path');

// services
const config = require('../../../service/config');
const rest = require('../../../service/rest');

Vue.component('Offline', {
	template: `
  <div v-bind:style="style">
    <h1>Network is not connected. <br>Please connect with the network.</h1>
  </div>`,
	data: function () {
		return {
			style: {
				width: '100%',
				height: '100%',
				padding: '24px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			},
		};
	},
	mounted: async function () {
		window.addEventListener('online', () => {
			// force reload the page
			setTimeout(() => {
				location.reload();
			}, 5000)

    });
	},
});
