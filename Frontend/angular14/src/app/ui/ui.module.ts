import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";

//
import { MaterialModule } from "../plugins/material.module";
import { PrimeNGModule } from "../plugins/primeng.module";

// user component
import { SafePipe } from "../plugins/safe.pipe";
import { UIElement } from "./ui-element.directive";
import { LayoutComponent } from "./layout/layout.component";
import { TypographyComponent } from "./typography/typography.component";
import { InputComponent } from "./input/input.component";
import { ButtonComponent } from "./button/button.component";
import { TableComponent } from "./table/table.component";
import { FormComponent } from "./form/form.component";
import { DateComponent } from "./date/date.component";
import { SelectionComponent } from "./selection/selection.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { IconComponent } from "./icon/icon.component";

@NgModule({
  declarations: [
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
    ProgressBarComponent,
    IconComponent,
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
    ProgressBarComponent,
    IconComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PrimeNGModule,
    FormsModule,
    DragDropModule,
  ],
  providers: [],
})
export class UIModule {}
