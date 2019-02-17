import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../core/material.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SignaturePadModule } from "angular2-signaturepad";
import { Ng2ImgMaxModule } from "ng2-img-max";
import { FileUploadModule } from "ng2-file-upload";

// validators
import { EvalValidator } from "../core/eval.validator";
import { JsonValidator } from "../core/json.validator";

// user component
import { DataTableComponent } from "./data-table/data-table.component";
import { FilterGroupComponent } from "./filter/filter-group.component";
import { FilterComponent } from "./filter/filter.component";
import { TextComponent } from "./text/text.component";
import { SelectionComponent } from "./selection/selection.component";
import { AutoCompleteComponent } from "./autocomplete/autocomplete.component";
import { DateComponent } from "./date/date.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { ScriptButtonComponent } from "./script-button/script-button.component";
import { CardListComponent } from "./card-list/card-list.component";
import { SignatureComponent } from "./signature/signature.component";
import { ImageUploadComponent } from "./img-upload/img-upload.component";
import { FormListComponent } from "./form-list/form-list.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { CalendarColumnComponent } from "./calendar/weekly/calendar-week.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { UILayoutWrapperComponent } from "./ui-layout-wrapper/ui-layout-wrapper.component";
import { TypographyComponent } from "./typography/typography.component";
import { SafePipe } from "../core/safe.pipe";

@NgModule({
  declarations: [
    SafePipe,
    UILayoutWrapperComponent,
    EvalValidator,
    JsonValidator,
    DataTableComponent,
    FilterGroupComponent,
    FilterComponent,
    TextComponent,
    SelectionComponent,
    AutoCompleteComponent,
    DateComponent,
    FileUploadComponent,
    ScriptButtonComponent,
    CardListComponent,
    SignatureComponent,
    ImageUploadComponent,
    FormListComponent,
    CalendarComponent,
    CalendarColumnComponent,
    PaginationComponent,
    TypographyComponent
  ],
  exports: [
    UILayoutWrapperComponent,
    DataTableComponent,
    FilterGroupComponent,
    TextComponent,
    SelectionComponent,
    AutoCompleteComponent,
    DateComponent,
    FileUploadComponent,
    ScriptButtonComponent,
    CardListComponent,
    SignatureComponent,
    ImageUploadComponent,
    FormListComponent,
    CalendarComponent,
    PaginationComponent,
    TypographyComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    NgxDatatableModule,
    SignaturePadModule,
    Ng2ImgMaxModule,
    FileUploadModule
  ]
})
export class UIModule {}
