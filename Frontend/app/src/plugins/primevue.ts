// @ts-nocheck

//
import "primevue/resources/themes/saga-blue/theme.css ";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

// prime vue
import primevue from "primevue/config";

import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import DialogService from "primevue/dialogservice";
import DynamicDialog from "primevue/dynamicdialog";
import FileUpload from "primevue/fileupload";
import Galleria from "primevue/galleria";
import Menu from "primevue/menu";
import Ripple from "primevue/ripple";
import Sidebar from "primevue/sidebar";
import Steps from "primevue/steps";
import SpeedDial from "primevue/speeddial";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import PanelMenu from "primevue/panelmenu";
import Row from "primevue/row";
import VirtualScroller from "primevue/virtualscroller";

export default {
  init(app) {
    //
    app.use(primevue, { ripple: true });
    app.use(ConfirmationService);
    app.use(ToastService);
    app.use(DialogService);
    //
    app.directive("ripple", Ripple);
    //
    app.component("Accordion", Accordion);
    app.component("AccordionTab", AccordionTab);
    app.component("AutoComplete", AutoComplete);
    app.component("Button", Button);
    app.component("ConfirmDialog", ConfirmDialog);
    app.component("Column", Column);
    app.component("ColumnGroup", ColumnGroup);
    app.component("DataTable", DataTable);
    app.component("Dialog", Dialog);
    app.component("DynamicDialog", DynamicDialog);
    app.component("FileUpload", FileUpload);
    app.component("Galleria", Galleria);
    app.component("Menu", Menu);
    app.component("Sidebar", Sidebar);
    app.component("Steps", Steps);
    app.component("SpeedDial", SpeedDial);
    app.component("Toast", Toast);
    app.component("PanelMenu", PanelMenu);
    app.component("Row", Row);
    app.component("VirtualScroller", VirtualScroller);
  },
};
