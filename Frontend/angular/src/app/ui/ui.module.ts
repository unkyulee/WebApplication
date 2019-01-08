import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../core/material.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { SignaturePadModule } from 'angular2-signaturepad';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { FileUploadModule } from 'ng2-file-upload'
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

// validators
import { EvalValidator } from '../core/eval.validator';
import { JsonValidator } from '../core/json.validator';

// user component
import { DataTableComponent } from './data-table/data-table.component';
import { DataTableListComponent } from './data-table/list/data-table-list.component';
import { DataTableAddComponent } from './data-table/add/data-table-add.component';
import { DataTableDetailComponent } from './data-table/detail/data-table-detail.component';
import { FilterGroupComponent } from './filter/filter-group.component';
import { FilterComponent } from './filter/filter.component';
import { TextComponent } from './text/text.component';
import { SelectionComponent } from './selection/selection.component';
import { AutoCompleteComponent } from './autocomplete/autocomplete.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { DateComponent } from './date/date.component';
import { SimpleTableComponent } from './simple-table/simple-table.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ScriptButtonComponent } from './script-button/script-button.component';
import { CardListComponent } from './card-list/card-list.component';
import { SignatureComponent } from './signature/signature.component';
import { ImageUploadComponent } from './img-upload/img-upload.component';
import { FormListComponent } from './form-list/form-list.component';
import { ChartComponent } from './chart/chart.component';
import { BigTextComponent } from './bigtext/bigtext.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarColumnComponent } from './calendar/column/calendar-column.component';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import { GanttComponent } from './gantt/gantt.component';

@NgModule({
  declarations: [
    EvalValidator
    , JsonValidator
    , DataTableComponent
    , DataTableListComponent
    , DataTableAddComponent
    , DataTableDetailComponent
    , FilterGroupComponent
    , FilterComponent
    , TextComponent
    , SelectionComponent
    , AutoCompleteComponent
    , TextAreaComponent
    , DateComponent
    , SimpleTableComponent
    , FileUploadComponent
    , ScriptButtonComponent
    , CheckboxComponent
    , CardListComponent
    , SignatureComponent
    , ImageUploadComponent
    , FormListComponent
    , ChartComponent
    , BigTextComponent
    , CalendarComponent
    , CalendarColumnComponent
    , JsonEditorComponent
    , GanttComponent
  ]
  , exports: [
    DataTableComponent
    , FilterGroupComponent
    , TextComponent
    , SelectionComponent
    , AutoCompleteComponent
    , TextAreaComponent
    , DateComponent
    , SimpleTableComponent
    , FileUploadComponent
    , ScriptButtonComponent
    , CheckboxComponent
    , CardListComponent
    , SignatureComponent
    , ImageUploadComponent
    , FormListComponent
    , ChartComponent
    , BigTextComponent
    , CalendarComponent
    , JsonEditorComponent
    , GanttComponent
  ]
  , imports: [
    CommonModule
    , RouterModule
    , FlexLayoutModule
    , MaterialModule
    , FormsModule
    , NgxDatatableModule
    , NgxDnDModule
    , SignaturePadModule
    , Ng2ImgMaxModule
    , FileUploadModule
    , NgxChartsModule
    , OwlDateTimeModule
    , OwlNativeDateTimeModule
  ],
})

export class UIModule { }
