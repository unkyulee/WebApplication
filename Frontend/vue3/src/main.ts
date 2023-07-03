// @ts-nocheck
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { loadFonts } from "./plugins/webfontloader";

// styles
import "../style.css";

//
loadFonts();

// app creation
const app = createApp(App);
// vuetify
import vuetify from "./plugins/vuetify";
app.use(vuetify);

// primevue
import primevue from "./plugins/primevue";
primevue.init(app);

// tools
import tools from "./plugins/tools";
tools.init(app);

///////////////////////////////////////////
// global setup
app.use(router);
app.mount("#app");
///////////////////////////////////////////
