// @ts-nocheck
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { loadFonts } from "./plugins/webfontloader";

// global js utility
import * as obj from "object-path";
window.obj = obj.default ? obj.default : obj;

import moment from "moment";
window.moment = moment.default ? moment.default : moment;

import mustache from "mustache";
window.mustache = mustache.default ? mustache.default : mustache;

// styles
import "../style.css";
import "primevue/resources/themes/saga-blue/theme.css ";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

//
loadFonts();

// app creation
const app = createApp(App);

// setup firebase
import { initializeApp } from "firebase/app";
if (obj.get(window, "__CONFIG__.firebase")) {
  // initialize firebase
  window.firebase = initializeApp(window.__CONFIG__.firebase);
}

// ui-imports
import UiElement from "./ui/UiElement.vue";
app.component("ui-element", UiElement);

import vuetify from "./plugins/vuetify";
app.use(vuetify);

// Datepicker
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
app.component("Datepicker", Datepicker);

// prime vue
import primevue from "primevue/config";
app.use(primevue, { ripple: true });

import Accordion from "primevue/accordion";
app.component("Accordion", Accordion);

import AccordionTab from "primevue/accordiontab";
app.component("AccordionTab", AccordionTab);

import AutoComplete from "primevue/autocomplete";
app.component("AutoComplete", AutoComplete);

import Galleria from "primevue/galleria";
app.component("Galleria", Galleria);

import VirtualScroller from "primevue/virtualscroller";
app.component("VirtualScroller", VirtualScroller);

import Ripple from "primevue/ripple";
app.directive("ripple", Ripple);

import PanelMenu from "primevue/panelmenu";
app.component("PanelMenu", PanelMenu);

import Sidebar from "primevue/sidebar";
app.component("Sidebar", Sidebar);

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Row", Row);

import ConfirmationService from "primevue/confirmationservice";
app.use(ConfirmationService);
import ConfirmDialog from "primevue/confirmdialog";
app.component("ConfirmDialog", ConfirmDialog);

import FileUpload from "primevue/fileupload";
app.component("FileUpload", FileUpload);

import Steps from "primevue/steps";
app.component("Steps", Steps);

import ToastService from "primevue/toastservice";
app.use(ToastService);

import Toast from "primevue/toast";
app.component("Toast", Toast);

///////////////////////////////////////////
// global setup
app.use(router);
app.mount("#app");
///////////////////////////////////////////
