const config = require('../../../service/config');
const event = require('../../../service/event');

Vue.component('Navigation', {
	template: `
	<md-list :style="style">

		<md-list-item
			v-for="(nav, index) in navs"
			:key="index"
			@click="click(nav)"
			style='position: relative'>

			<md-badge v-if="nav.badge" :md-content="nav.badge" style='position: absolute; right: 4px'></md-badge>
			<md-tooltip md-direction="right">{{nav.name}}</md-tooltip>
			<i v-if="nav.type != 'collapse'" :class="nav.icon" :style="nav.style"></i>
			<md-menu v-if="nav.type == 'collapse'" md-size="auto" :md-offset-x="60" :md-offset-y="-30" :md-active="nav.active">
				<i :class="nav.icon" :style="nav.style"></i>
				<md-menu-content>
					<md-menu-item v-for="(child, child_index) in nav.children" :key="child_index" @click="click(child)">
						{{child.name}}
					</md-menu-item>
				</md-menu-content>
			</md-menu>
		</md-list-item>
	</md-list>
	`,
	mounted: async function() {
		// listen to login-success and logout event
		event.subscribe('navigation', 'navigation-updated', async () => {
			// copy nav
			let navs = [];
			for (let nav of config.get('nav')) {
				if (nav.type == 'hidden') continue;

				// add icon for config menu
				if (nav.permissions && nav.permissions.indexOf('config.view') >= 0) {
					nav.icon = 'fa fa-lg fa-cog';
					nav.url = `${config.get('service_url')}${nav.children[0].url}`;
				}

				// set all menu inactive
				nav.style = this.inactive;

				// check permission
				if (nav.permissions) {
					if (permission.permitted(nav.permissions)) {
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

		// listen to login-success and logout event
		event.subscribe('navigation', 'nav-selected', selectedNav => {
			for (let nav of this.navs) {
				// set menu item inactive
				this.$set(nav, 'style', this.inactive);

				// see if the item is the selected one
				let selected = false;

				if (nav.id == selectedNav.id) selected = true;
				else if (nav.children && nav.children.find(x => x.id == selectedNav.id)) selected = true;

				// set active
				if (selected) this.$set(nav, 'style', this.active);
			}
		});

		// listen to badge-update
		event.subscribe('navigation', 'nav-badge', nav => {
			// find the matching nav
			let selectedNav = this.navs.find(x => (x.id = nav.id));
			if (selectedNav) {
				this.$set(selectedNav, 'badge', nav.badge);
			}
		});
	},
	destroyed: function() {
		// stop listen to drawer-toggle event
		event.unsubscribe_all('navigation');
	},
	data: function() {
		return {
			style: {
				width: '60px',
				height: '100%',
				background: '#202020',
				boxShadow: '1px 0 15px rgba(0, 0, 0, 0.07)',
				overflowY: 'auto',
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
			if (selectedNav.type != 'collapse') {
				// send menu selected
				event.send('nav-selected', selectedNav);
			} else {
				// open popup
				this.$set(selectedNav, 'active', false);
				setTimeout(() => {
					this.$set(selectedNav, 'active', true);
				})
			}
		},
	},
});
