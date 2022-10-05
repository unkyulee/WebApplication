import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

//
loadFonts();

//
import UiElement from "./layout/Content/UiElement.vue";

createApp(App)
  .component("ui-element", UiElement)
  .use(router)
  .use(vuetify)
  .mount("#app");
