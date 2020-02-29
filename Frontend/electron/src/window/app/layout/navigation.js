const config = require('../../../service/config');
const event = require('../../../service/event');

Vue.component('Navigation', {
	template: `
	<md-list
		:style="style">
		<md-list-item
			v-for="(nav, index) in navs"
			@click="click(nav)"
			:key="index">
			<i :class="nav.icon" :style="nav.style"></i>
			<md-tooltip md-direction="right">{{nav.name}}</md-tooltip>
		</md-list-item>
	</md-list>
	`,
	mounted: async function() {
		// listen to login-success and logout event
		event.subscribe('navigation', 'navigation-updated', async () => {
			// copy nav
			let navs = [];
			for (let nav of config.get('nav')) {
				if(nav.type == 'hidden') continue;

				// add icon for config menu
				if(nav.permissions && nav.permissions.indexOf("config.view") >= 0) {
					nav.icon = "fa fa-lg fa-cog"
					nav.url = nav.children[0].url
				}

				// set all menu inactive
				nav.style = this.inactive;

				// check permission
				if(nav.permissions) {
					if(permission.permitted(nav.permissions)) {
						navs.push(nav);
					}
				} else {
					navs.push(nav);
				}
			}

			//
			this.navs = navs;

			// select the first menu
			this.click(this.navs[0]);
		});
	},
	destroyed: function() {
		// stop listen to drawer-toggle event
		event.unsubscribe_all('navigation');
	},
	data: function() {
		return {
			style: {
				width: '52px',
				height: '100%',
				background: '#202020',
				boxShadow: '1px 0 15px rgba(0, 0, 0, 0.07)',
			},
			active: {
				color: 'white',
			},
			inactive: {
				color: 'darkgray',
			},
			navs: [],
		};
	},
	methods: {
		click: function(selectedNav) {
			// toggle active
			let newNavs = [];
			for (let nav of this.navs) {
				if (nav == selectedNav) {
					nav.style = this.active;
				} else {
					nav.style = this.inactive;
				}
				newNavs.push(nav);
			}
			this.navs = newNavs;

			// send menu selected
			event.send('nav-selected', selectedNav);
		},
	},
});
