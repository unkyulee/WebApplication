require('./typography');
require('./input');
require('./button');
require("./webview")

Vue.component('UiElement', {
	name: 'UiElement',
	template: `
  <keep-alive>
    <Typography
      v-if="uiElement.type == 'typography'"
      :uiElement="uiElement"
      :data="data"
      :class="uiElement.layoutClass"
    	:style="uiElement.layoutStyle"
    />
    <InputElement
      v-if="uiElement.type == 'input'"
      :uiElement="uiElement"
      :data="data"
      :class="uiElement.layoutClass"
    	:style="uiElement.layoutStyle"
    />
    <ButtonElement
      v-if="uiElement.type == 'button'"
      :uiElement="uiElement"
      :data="data"
      :class="uiElement.layoutClass"
    	:style="uiElement.layoutStyle"
    />
    <WebView
      v-if="uiElement.type == 'webview'"
      :uiElement="uiElement"
      :data="data"
      :style="uiElement.layoutStyle"
      :class="uiElement.layoutClass"
    />
  </keep-alive>
  `,
	props: ['uiElement', 'data'],
});
