const config = require('../../../service/config');
const event = require('../../../service/event');

// ui
require('../ui/ui-element');

Vue.component('Composer', {
	template: `
	<div style="width: 100%; height: 100%">
		<div v-for="viewport in viewports" :style="viewport.layoutStyle">
			<UiElement
				v-for="(screen, index) in viewport.screens"
				:key="index"
				:uiElement="screen"
				:data="data" />
		</div>
	</div>
	`,
	data: function() {
		return {
			hide: {
				visibility: 'hidden',
				width: 0,
				height: 0,
			},
			show: {
				width: '100%',
				height: '100%',
				display: "flex",
				flexFlow: "row wrap"
			},
			viewports: [],
			data: {},
		};
	},
	mounted: async function() {
		// listen to navigation-updated
		event.subscribe('composer', 'navigation-updated', async () => {
			// copy screens
			let navs = config.get('nav');
			// find out how many viewports are configured
			let viewport = {};
			for (let nav of navs) {
				// loop through navs and group by viewport
				if (!viewport[nav.viewport]) viewport[nav.viewport] = nav;
			}

			// create screens as many numbers of viewport
			let viewports = [];
			for (let vp of Object.keys(viewport)) {
				if (!viewport[vp].screens) {
					viewport[vp].screens = [
						{
							type: 'webview',
							id: 'default',
							src: viewport[vp].url,
							layoutStyle: {
								width: '100%',
								height: '100%',
							},
						},
					];
				}
				viewports.push({
					...viewport[vp],
					layoutStyle: this.hide,
				});
			}
			// set
			this.viewports = viewports;
		});

		// listen to nav-selected
		event.subscribe('composer', 'nav-selected', nav => {
			// hide all the screen
			for (let viewport of this.viewports) {
				// show the selected screen
				if (viewport.viewport == nav.viewport) {
					viewport.layoutStyle = this.show;
					// update the url of the first screen
					if(nav.url) viewport.screens[0].src = nav.url;
				}
				// hide other screens
				else viewport.layoutStyle = this.hide;
			}
		});
	},
	destroyed: function() {
		// stop listen to drawer-toggle event
		event.unsubscribe_all('composer');
	},
});
