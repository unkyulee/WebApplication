import { NgModule } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { ChartModule } from "primeng/chart";
import { ColorPickerModule } from "primeng/colorpicker";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { EditorModule } from "primeng/editor";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { PaginatorModule } from "primeng/paginator";
import { PanelMenuModule } from "primeng/panelmenu";
import { PickListModule } from "primeng/picklist";
import { SliderModule } from "primeng/slider";
import { SidebarModule } from "primeng/sidebar";
import { SplitterModule } from "primeng/splitter";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { TreeTableModule } from "primeng/treetable";
import { VirtualScrollerModule } from "primeng/virtualscroller";

@NgModule({
  imports: [
    ButtonModule,
    ChartModule,
    ColorPickerModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    EditorModule,
    FileUploadModule,
    InputTextModule,
    TableModule,
    MenuModule,
    PaginatorModule,
    PanelMenuModule,
    PickListModule,
    SidebarModule,
    SliderModule,
    ToastModule,
    TreeTableModule,
    SplitterModule,
    VirtualScrollerModule,
  ],
  exports: [
    ButtonModule,
    ChartModule,
    ColorPickerModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    EditorModule,
    FileUploadModule,
    InputTextModule,
    TableModule,
    MenuModule,
    PaginatorModule,
    PanelMenuModule,
    PickListModule,
    SidebarModule,
    SliderModule,
    ToastModule,
    TreeTableModule,
    SplitterModule,
    VirtualScrollerModule,
  ],
})
export class PrimeNGModule {}
