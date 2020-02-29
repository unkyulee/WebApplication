const obj = require('object-path');

Vue.component('Typography', {
	template: `
		<div
			v-if="condition(uiElement) && value()"
			v-html="value()"
			@click="click($event)"
			:class="uiElement.class"
			:style="uiElement.style"
		></div>
	`,
	props: ['uiElement', 'data'],
	data: function() {
		return {};
	},
	methods: {
		condition: function(uiElement) {
			let passed = true;
			if (uiElement.condition) {
				passed = eval(uiElement.condition);
			}
			return passed;
		},
		value: function() {
			let text = null;

			// fixed text
			if (this.uiElement.text) {
				// set value
				text = this.uiElement.text;
			}

			// key exists
			else if (this.data && this.uiElement.key) {
				// set value
				text = obj.get(this.data, this.uiElement.key);
			}

			// if null then assign default
			if ((typeof this._value == 'undefined' || this._value == null) && this.uiElement.default) {
				text = this.uiElement.default;
				try {
					text = eval(this.uiElement.default);
				} catch (e) {}
			}

			// if format is specified
			if (this.uiElement.format) {
				try {
					text = eval(this.uiElement.format);
				} catch (e) {
					console.error(this.uiElement.format, e);
				}
			}

			return text;
		},
	},
});
