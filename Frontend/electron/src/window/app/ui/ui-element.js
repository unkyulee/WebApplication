require('./typography');
require('./input');
require('./button');

Vue.component('UiElement', {
	template: `
  <keep-alive>
    <Typography
      v-if="uiElement.type == 'typography'"
      v-bind:uiElement="uiElement"
      v-bind:data="data"
      :class="uiElement.layoutClass"
    	:style="uiElement.layoutStyle"
    />
    <InputElement
      v-if="uiElement.type == 'input'"
      v-bind:uiElement="uiElement"
      v-bind:data="data"
      :class="uiElement.layoutClass"
    	:style="uiElement.layoutStyle"
    />
    <ButtonElement
      v-if="uiElement.type == 'button'"
      v-bind:uiElement="uiElement"
      v-bind:data="data"
      :class="uiElement.layoutClass"
    	:style="uiElement.layoutStyle"
    />
  </keep-alive>
  `,
	props: ['uiElement', 'data'],
});
