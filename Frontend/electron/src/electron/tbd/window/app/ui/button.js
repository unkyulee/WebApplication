const obj = require('object-path');
const _event = require('../../../service/event');

Vue.component('ButtonElement', {
	template: `
    <md-button
      class="md-raised"
      v-if="condition(uiElement)"
      @click="click($event)"
      :class="uiElement.class"
      :style="uiElement.style">
      {{uiElement.label}}
    </md-button>
 	`,
	props: ['uiElement', 'data'],
	methods: {
		condition: function(uiElement) {
			let passed = true;
			if (uiElement.condition) {
				passed = eval(uiElement.condition);
			}
			return passed;
		},
		click: async function(event, item, script) {
			let clickScript = script ? script : this.uiElement.click;
			if (clickScript) {
				try {
					await eval(clickScript);
				} catch (e) {
					console.error(e);
				}
			}
    }
  },
  computed: {
    event: function(sender) {
      return {
        send: function(e) {
          _event.send(e.name, e);
        }
      }
    }
  }
});
