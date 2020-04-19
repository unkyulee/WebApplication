Vue.component('WebView', {
	template: `
  <webview
    :useragent="uiElement.useragent"
    :partition="uiElement.partition?uiElement.partition:'default'"
    :src="uiElement.src?uiElement.src: '_blank'"
    :id="uiElement.id"
    :style="uiElement.style"
    :class="uiElement.class"
    preload="./app/ui/webview_preload.js" />
	`,
	props: ['uiElement', 'data'],
	mounted: async function() {
		// add http...
		if (this.uiElement.src && !this.uiElement.src.startsWith('http'))
			this.uiElement.src = `${config.get('service_url')}${this.uiElement.src}`;
		// preload
		if (this.uiElement.preload) {
			// download the preload script
			let script = await rest.request(
				`${config.get('service_url')}/ui.element?uiElementId=${this.uiElement.preload}`
			);
			config.set(`preload.${this.uiElement.preload}`, script.data.script);
			// #preload_element_id
			this.uiElement.src = `${this.uiElement.src}#${this.uiElement.preload}`;
		}
	},
});
