import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../core/material.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SignaturePadModule } from "angular2-signaturepad";
import { Ng2ImgMaxModule } from "ng2-img-max";
import { FileUploadModule } from "ng2-file-upload";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { ScrollDispatchModule } from "@angular/cdk/scrolling";

// validators
import { EvalValidator } from "../core/eval.validator";
import { JsonValidator } from "../core/json.validator";
import { AutofocusDirective } from '../core/autofocus';

// user component
import { DataTableComponent } from "./data-table/data-table.component";
import { InputComponent } from "./input/input.component";
import { SelectionComponent } from "./selection/selection.component";
import { ButtonComponent } from "./button/button.component";
import { SignatureComponent } from "./signature/signature.component";
import { UploaderComponent } from "./uploader/uploader.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { CalendarMonthlyComponent } from "./calendar/monthly/calendar-monthly.component"
import { CalendarWeeklyComponent } from "./calendar/weekly/calendar-weekly.component";
import { CalendarDailyComponent } from "./calendar/daily/calendar-daily.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { UILayoutWrapperComponent } from "./ui-layout-wrapper/ui-layout-wrapper.component";
import { TypographyComponent } from "./typography/typography.component";
import { SafePipe } from "../core/safe.pipe";
import { FormGeneratorComponent } from "./form-generator/form-generator.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { UILayoutComponent } from "./ui-layout/ui-layout.component";
import { DividerComponent } from './divider/divider.component';
import { DataSheetComponent } from './data-sheet/data-sheet.component';
import { BaseComponent } from './base.component';
import { PopupMenuComponent } from './popup-menu/popup-menu.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { TreeComponent } from './tree/tree.component';

@NgModule({
  declarations: [
    SafePipe,
    UILayoutWrapperComponent,
    UILayoutComponent,
    EvalValidator,
    JsonValidator,
    AutofocusDirective,
    DataTableComponent,
    FormGeneratorComponent,
    InputComponent,
    SelectionComponent,    
    UploaderComponent,
    ButtonComponent,
    SignatureComponent,
    CalendarComponent,
    CalendarMonthlyComponent,
    CalendarWeeklyComponent,
    CalendarDailyComponent,
    PaginationComponent,
    TypographyComponent,
    ProgressBarComponent,    
    DividerComponent,
    DataSheetComponent,
    BaseComponent,
    PopupMenuComponent,
    CodeEditorComponent,
    TreeComponent
  ],
  entryComponents: [
    UILayoutWrapperComponent,
    UILayoutComponent,
    DataTableComponent,
    FormGeneratorComponent,
    InputComponent,
    SelectionComponent,    
    UploaderComponent,
    ButtonComponent,
    SignatureComponent,
    CalendarComponent,
    CalendarMonthlyComponent,
    CalendarWeeklyComponent,
    CalendarDailyComponent,
    PaginationComponent,
    TypographyComponent,
    ProgressBarComponent,    
    DividerComponent,
    DataSheetComponent,
    BaseComponent,
    PopupMenuComponent,
    CodeEditorComponent,
    TreeComponent
  ],
  exports: [
    UILayoutWrapperComponent,
    UILayoutComponent,
    DataTableComponent,
    FormGeneratorComponent,
    InputComponent,
    SelectionComponent,    
    ButtonComponent,
    SignatureComponent,
    UploaderComponent,
    CalendarComponent,
    PaginationComponent,
    TypographyComponent,
    ProgressBarComponent,    
    UILayoutComponent,
    DividerComponent,
    DataSheetComponent,
    BaseComponent,
    PopupMenuComponent,
    CodeEditorComponent,
    TreeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    NgxDatatableModule,
    SignaturePadModule,
    Ng2ImgMaxModule,
    FileUploadModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ScrollingModule,
    ScrollDispatchModule,
    MonacoEditorModule
  ]
})
export class UIModule {}
