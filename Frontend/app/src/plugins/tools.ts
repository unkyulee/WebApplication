// @ts-nocheck

// Datepicker
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

// object-path
import * as obj from "object-path";
window.obj = obj.default ? obj.default : obj;

// moment
import moment from "moment";
window.moment = moment.default ? moment.default : moment;

// axios
import axios from "axios";
window.axios = axios;

// mustache
import mustache from "mustache";
window.mustache = mustache.default ? mustache.default : mustache;

// vue-cookies
import cookies from "vue-cookies";

// ui-imports
import UiElement from "../ui/UiElement.vue";

export default {
  init(app) {
    app.component("Datepicker", Datepicker);
    app.component("ui-element", UiElement);

    // vue cookies
    app.use(cookies);
  },
};
