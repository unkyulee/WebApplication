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

// ui-imports
import UiElement from "./layout/Content/UiElement.vue";
app.component("ui-element", UiElement);

import vuetify from "./plugins/vuetify";
app.use(vuetify);

// prime vue
import PrimeVue from "primevue/config";
app.use(PrimeVue, { ripple: true });

import Accordion from "primevue/accordion";
app.component("Accordion", Accordion);

import AccordionTab from "primevue/accordiontab";
app.component("AccordionTab", AccordionTab);

import AutoComplete from "primevue/autocomplete";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
import Badge from "primevue/badge";
//import BadgeDirective from "primevue/badgedirective/BadgeDirective";
import BlockUI from "primevue/blockui";
import Breadcrumb from "primevue/breadcrumb";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Card from "primevue/card";
import Carousel from "primevue/carousel";
import CascadeSelect from "primevue/cascadeselect";
//import Chart from "primevue/chart/Chart";
import Checkbox from "primevue/checkbox";
import Chip from "primevue/chip";
import Chips from "primevue/chips";
import ColorPicker from "primevue/colorpicker";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
//import ConfirmationService from "primevue/confirmationservice/ConfirmationService";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmPopup from "primevue/confirmpopup";

//import DataTable from "primevue/datatable/DataTable";
import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import DeferredContent from "primevue/deferredcontent";
//import Dialog from "primevue/dialog/Dialog";
//import DialogService from "primevue/dialogservice/DialogService";
import Divider from "primevue/divider";
import Dock from "primevue/dock";
import Dropdown from "primevue/dropdown";
import DynamicDialog from "primevue/dynamicdialog";

//import Editor from "primevue/editor/Editor";
//app.component("Editor", Editor);

import Fieldset from "primevue/fieldset";
import FileUpload from "primevue/fileupload";

//import FullCalendar from "primevue/fullcalendar";
//app.component("FullCalendar", FullCalendar);

import Galleria from "primevue/galleria";
app.component("Galleria", Galleria);

//import Image from "primevue/image";
//app.component("Image", Image);

import InlineMessage from "primevue/inlinemessage";
import Inplace from "primevue/inplace";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import Knob from "primevue/knob";
import Listbox from "primevue/listbox";
import MegaMenu from "primevue/megamenu";
import Menu from "primevue/menu";
import Menubar from "primevue/menubar";
import Message from "primevue/message";
import MultiSelect from "primevue/multiselect";
import OrderList from "primevue/orderlist";
import OrganizationChart from "primevue/organizationchart";
import OverlayPanel from "primevue/overlaypanel";
import Paginator from "primevue/paginator";
import Panel from "primevue/panel";
import PanelMenu from "primevue/panelmenu";
import Password from "primevue/password";
import PickList from "primevue/picklist";

//import ProgressBar from "primevue/progressbar";
//app.component("ProgressBar", ProgressBar);
//import ProgressSpinner from "primevue/progressspinner";
//app.component("ProgressSpinner", ProgressSpinner);
//import RadioButton from "primevue/radiobutton";
//app.component("RadioButton", RadioButton);
//import Rating from "primevue/rating";
//app.component("Rating", Rating);

import Ripple from "primevue/ripple";
app.directive("ripple", Ripple);

import Row from "primevue/row";
import ScrollPanel from "primevue/scrollpanel";
import ScrollTop from "primevue/scrolltop";
import SelectButton from "primevue/selectbutton";
import Sidebar from "primevue/sidebar";
import Skeleton from "primevue/skeleton";
import Slider from "primevue/slider";
import SpeedDial from "primevue/speeddial";
import SplitButton from "primevue/splitbutton";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Steps from "primevue/steps";

import StyleClass from "primevue/styleclass";
app.directive("styleclass", StyleClass);

import TabMenu from "primevue/tabmenu";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import Tag from "primevue/tag";
import Terminal from "primevue/terminal";
import Textarea from "primevue/textarea";
import TieredMenu from "primevue/tieredmenu";
import Timeline from "primevue/timeline";

import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
app.use(ToastService);

import ToggleButton from "primevue/togglebutton";
import Toolbar from "primevue/toolbar";

import Tooltip from "primevue/tooltip";
app.directive("tooltip", Tooltip);

import Tree from "primevue/tree";
import TreeSelect from "primevue/treeselect";
import TreeTable from "primevue/treetable";
import TriStateCheckbox from "primevue/tristatecheckbox";

import VirtualScroller from "primevue/virtualscroller";
app.component("VirtualScroller", VirtualScroller);

app.component("Avatar", Avatar);
app.component("AvatarGroup", AvatarGroup);
app.component("AutoComplete", AutoComplete);
app.component("Badge", Badge);
app.component("BlockUI", BlockUI);
app.component("Breadcrumb", Breadcrumb);
app.component("Button", Button);
app.component("Calendar", Calendar);
app.component("Card", Card);
app.component("Carousel", Carousel);
app.component("CascadeSelect", CascadeSelect);
//app.component("Chart", Chart);
app.component("Checkbox", Checkbox);
app.component("Chip", Chip);
app.component("Chips", Chips);
app.component("ColorPicker", ColorPicker);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("ConfirmDialog", ConfirmDialog);
app.component("ConfirmPopup", ConfirmPopup);

app.component("ContextMenu", ContextMenu);
import ContextMenu from "primevue/contextmenu";

//app.component("DataTable", DataTable);
app.component("DataView", DataView);
app.component("DataViewLayoutOptions", DataViewLayoutOptions);
app.component("DeferredContent", DeferredContent);
//app.component("Dialog", Dialog);
app.component("DynamicDialog", DynamicDialog);
app.component("Divider", Divider);
app.component("Dock", Dock);
app.component("Dropdown", Dropdown);

app.component("Fieldset", Fieldset);
app.component("FileUpload", FileUpload);

app.component("InlineMessage", InlineMessage);
app.component("Inplace", Inplace);
app.component("InputMask", InputMask);
app.component("InputNumber", InputNumber);
app.component("InputSwitch", InputSwitch);
app.component("InputText", InputText);
app.component("Knob", Knob);
app.component("Listbox", Listbox);
app.component("MegaMenu", MegaMenu);
app.component("Menu", Menu);
app.component("Menubar", Menubar);
app.component("Message", Message);
app.component("MultiSelect", MultiSelect);
app.component("OrderList", OrderList);
app.component("OrganizationChart", OrganizationChart);
app.component("OverlayPanel", OverlayPanel);
app.component("Paginator", Paginator);
app.component("Panel", Panel);
app.component("PanelMenu", PanelMenu);
app.component("Password", Password);
app.component("PickList", PickList);

app.component("Row", Row);
app.component("ScrollPanel", ScrollPanel);
app.component("ScrollTop", ScrollTop);
app.component("SelectButton", SelectButton);
app.component("Slider", Slider);
app.component("Sidebar", Sidebar);
app.component("Skeleton", Skeleton);
app.component("SpeedDial", SpeedDial);
app.component("SplitButton", SplitButton);
app.component("Splitter", Splitter);
app.component("SplitterPanel", SplitterPanel);
app.component("Steps", Steps);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);
app.component("TabMenu", TabMenu);
app.component("Tag", Tag);
app.component("Terminal", Terminal);
app.component("Textarea", Textarea);
app.component("TieredMenu", TieredMenu);
app.component("Timeline", Timeline);
app.component("Toast", Toast);
app.component("Toolbar", Toolbar);
app.component("ToggleButton", ToggleButton);
app.component("Tree", Tree);
app.component("TreeSelect", TreeSelect);
app.component("TreeTable", TreeTable);
app.component("TriStateCheckbox", TriStateCheckbox);

// global setup
app.use(router);
app.mount("#app");
