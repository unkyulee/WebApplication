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
import Galleria from "primevue/galleria";
import VirtualScroller from "primevue/virtualscroller";
import Ripple from "primevue/ripple";
import PanelMenu from "primevue/panelmenu";
import Sidebar from "primevue/sidebar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import FileUpload from "primevue/fileupload";
import Steps from "primevue/steps";
import Dialog from "primevue/dialog";
import DialogService from "primevue/dialogservice";
import DynamicDialog from "primevue/dynamicdialog";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";

export default {
  init(app) {
    app.use(primevue, { ripple: true });
    app.use(ConfirmationService);
    app.use(ToastService);
    app.use(DialogService);

    app.component("Accordion", Accordion);
    app.component("AccordionTab", AccordionTab);
    app.component("AutoComplete", AutoComplete);
    app.component("Galleria", Galleria);
    app.component("VirtualScroller", VirtualScroller);
    app.directive("ripple", Ripple);
    app.component("PanelMenu", PanelMenu);
    app.component("Sidebar", Sidebar);
    app.component("DataTable", DataTable);
    app.component("Column", Column);
    app.component("ColumnGroup", ColumnGroup);
    app.component("Row", Row);
    app.component("ConfirmDialog", ConfirmDialog);
    app.component("FileUpload", FileUpload);
    app.component("Steps", Steps);
    app.component("Dialog", Dialog);
    app.component("DynamicDialog", DynamicDialog);
    app.component("Toast", Toast);
  },
};
