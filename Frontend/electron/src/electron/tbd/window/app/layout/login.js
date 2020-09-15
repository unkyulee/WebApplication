const rest = require('../../../service/rest');
const config = require('../../../service/config');
const event = require('../../../service/event');
const auth = require('../../../service/auth');

// ui
require('../ui/ui-element');

Vue.component('Login', {
	template: `
	<div
		:class="uiElement.layoutClass"
		:style="uiElement.layoutStyle">
		<div
			:class="uiElement.class"
			:style="uiElement.style">
				<UiElement
					v-for="(ui, index) in uiElement.screens"
					:key="index"
					:uiElement="ui"
					:data="data" />
		</div>
	</div>
	`,
	mounted: async function() {
		let url = config.get('service_url');
		let response = await rest.request(`${url}/login.config`);
		this.uiElement = response.data;

		// subscribe to login event
		event.subscribe('login', 'login', e => {
			this.login();
		});
	},
	destroyed: function() {
		// subscribe to login event
		event.unsubscribe_all('login');
	},
	data: function() {
		return {
			style: {},
			uiElement: {},
			data: {},
		};
	},
	methods: {
		login: async function() {
			// reset error message
			delete this.data.error;
			this.data = { ...this.data }

			// try login
			try {
				await auth.authenticate(this.data);
			} catch (e) {
				let status = e.response.status;
				this.data = {
					...this.data,
					error: this.uiElement.errors[status]
				}
			}
		},
	},
});
