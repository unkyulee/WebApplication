import { NgModule } from "@angular/core";
import { EditorModule } from "primeng/editor";
import { ColorPickerModule } from "primeng/colorpicker";
import { TableModule } from "primeng/table";
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { TreeTableModule } from "primeng/treetable";
import { PanelMenuModule } from "primeng/panelmenu";
import { SliderModule } from "primeng/slider";
import { MenuModule } from "primeng/menu";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { SidebarModule } from "primeng/sidebar";
import { ToastModule } from "primeng/toast";

@NgModule({
  imports: [
    EditorModule,
    ColorPickerModule,
    TableModule,
    VirtualScrollerModule,
    InputTextModule,
    ButtonModule,
    TreeTableModule,
    PanelMenuModule,
    SliderModule,
    MenuModule,
    DynamicDialogModule,
    SidebarModule,
    ToastModule,
  ],
  exports: [
    EditorModule,
    ColorPickerModule,
    TableModule,
    VirtualScrollerModule,
    InputTextModule,
    ButtonModule,
    TreeTableModule,
    PanelMenuModule,
    SliderModule,
    MenuModule,
    DynamicDialogModule,
    SidebarModule,
    ToastModule,
  ],
})
export class PrimeNGModule {}
