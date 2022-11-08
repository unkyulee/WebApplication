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
  ],
})
export class PrimeNGModule {}
