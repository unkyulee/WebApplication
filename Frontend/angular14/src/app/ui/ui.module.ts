import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";

//
import { MaterialModule } from "../plugins/material.module";
import { PrimeNGModule } from "../plugins/primeng.module";
import { MonacoEditorModule } from "ngx-monaco-editor";

// user component
import { SafePipe } from "../plugins/safe.pipe";
import { UIElement } from "./ui-element.directive";
// components
import { ButtonComponent } from "./button/button.component";
import { CodeComponent } from "./code/code.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { ChartComponent } from "./chart/chart.component";
import { DateComponent } from "./date/date.component";
import { DropGroupComponent } from "./drop-group/drop-group.component";
import { EditorComponent } from "./editor/editor.component";
import { FormComponent } from "./form/form.component";
import { GridComponent } from "./grid/grid.component";
import { IconComponent } from "./icon/icon.component";
import { ImageComponent } from "./image/image.component";
import { InputComponent } from "./input/input.component";
import { LayoutComponent } from "./layout/layout.component";
import { MenuComponent } from "./menu/menu.component";
import { ProgressComponent } from "./progress/progress.component";
import { SelectionComponent } from "./selection/selection.component";
import { TableComponent } from "./table/table.component";
import { TreeComponent } from "./tree/tree.component";
import { TypographyComponent } from "./typography/typography.component";
import { UploaderComponent } from "./uploader/uploader.component";

// calendar modules
import * as moment from "moment";
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarMomentDateFormatter,
  DateAdapter,
  MOMENT,
} from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/moment";
export function momentAdapterFactory() {
  return adapterFactory(moment);
}

//
// locale registration
import { registerLocaleData } from "@angular/common";
import it from "@angular/common/locales/it";
registerLocaleData(it);

@NgModule({
  declarations: [
    SafePipe,
    UIElement,
    LayoutComponent,
    ButtonComponent,
    CodeComponent,
    CalendarComponent,
    ChartComponent,
    DateComponent,
    DropGroupComponent,
    EditorComponent,
    FormComponent,
    GridComponent,
    IconComponent,
    InputComponent,
    ImageComponent,
    MenuComponent,
    ProgressComponent,
    SelectionComponent,
    TableComponent,
    TreeComponent,
    TypographyComponent,
    UploaderComponent,
  ],
  exports: [
    SafePipe,
    UIElement,
    LayoutComponent,
    TypographyComponent,
    InputComponent,
    ButtonComponent,
    TableComponent,
    FormComponent,
    DateComponent,
    SelectionComponent,
    ProgressComponent,
    IconComponent,
    EditorComponent,
    CodeComponent,
    MenuComponent,
    CalendarComponent,
    GridComponent,
    DropGroupComponent,
    ImageComponent,
    TreeComponent,
    UploaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PrimeNGModule,
    FormsModule,
    DragDropModule,
    MonacoEditorModule,
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter,
        },
      }
    ),
  ],
  providers: [
    {
      provide: MOMENT,
      useValue: moment,
    },
  ],
})
export class UIModule {}
