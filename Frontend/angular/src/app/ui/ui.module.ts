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

// validators
import { EvalValidator } from "../core/eval.validator";
import { JsonValidator } from "../core/json.validator";

// user component
import { DataTableComponent } from "./data-table/data-table.component";
import { FilterGroupComponent } from "./filter/filter-group.component";
import { FilterComponent } from "./filter/filter.component";
import { InputComponent } from "./input/input.component";
import { SelectionComponent } from "./selection/selection.component";
import { AutoCompleteComponent } from "./autocomplete/autocomplete.component";
import { ButtonComponent } from "./button/button.component";
import { SignatureComponent } from "./signature/signature.component";
import { UploaderComponent } from "./uploader/uploader.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { CalendarColumnComponent } from "./calendar/weekly/calendar-week.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { UILayoutWrapperComponent } from "./ui-layout-wrapper/ui-layout-wrapper.component";
import { TypographyComponent } from "./typography/typography.component";
import { SafePipe } from "../core/safe.pipe";
import { FormGeneratorComponent } from "./form-generator/form-generator.component";

@NgModule({
  declarations: [
    SafePipe,
    UILayoutWrapperComponent,
    EvalValidator,
    JsonValidator,
    DataTableComponent,
    FormGeneratorComponent,
    FilterGroupComponent,
    FilterComponent,
    InputComponent,
    SelectionComponent,
    AutoCompleteComponent,
    UploaderComponent,
    ButtonComponent,
    SignatureComponent,
    CalendarComponent,
    CalendarColumnComponent,
    PaginationComponent,
    TypographyComponent
  ],
  exports: [
    UILayoutWrapperComponent,
    DataTableComponent,
    FormGeneratorComponent,
    FilterGroupComponent,
    InputComponent,
    SelectionComponent,
    AutoCompleteComponent,
    ButtonComponent,
    SignatureComponent,
    UploaderComponent,
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
    FileUploadModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class UIModule {}
