const config = require('../../../service/config');
const event = require('../../../service/event');
const obj = require("object-path");
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
		// listen to nav-selected
		event.subscribe('composer', 'nav-selected', nav => {
			console.log(JSON.parse(JSON.stringify(nav)))
			console.log(JSON.parse(JSON.stringify(this.viewports)))

			// hide all the screen
			for (let viewport of this.viewports) {
				viewport.layoutStyle = this.hide;
			}

			// create viewport if not exists
			let viewport = this.viewports.find(x => x.id == nav.id);
			if(!viewport) {
				viewport = {
					id: nav.id,
					layoutStyle: {
						width: '100%',
						height: '100%'
					},
					screens: [
						{
							type: 'webview',
							id: nav.id,
							src: nav.url,
							layoutStyle: {
								width: '100%',
								height: '100%',
							},
						}
					]
				}
				// if the nav has custom screen
				if(nav.screens) viewport.screens = nav.screens;

				// add viewport
				this.viewports.push(viewport);
			}

			// show the viewport
			viewport.layoutStyle = this.show;

		});
	},
	destroyed: function() {
		// stop listen to drawer-toggle event
		event.unsubscribe_all('composer');
	},
});
