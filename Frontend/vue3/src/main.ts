import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

//
loadFonts();

// app creation
const app = createApp(App);

// ui-imports
import UiElement from "./layout/Content/UiElement.vue";
app.component("ui-element", UiElement);

import VueVirtualScroller from "vue-virtual-scroller";
app.use(VueVirtualScroller);

// global setup
app.use(router);
app.use(vuetify);
app.mount("#app");
