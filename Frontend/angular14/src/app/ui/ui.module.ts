import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

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

@NgModule({
  declarations: [
    SafePipe,
    UIElement,
    LayoutComponent,
    TypographyComponent,
    InputComponent,
    ButtonComponent,
    TableComponent,
  ],
  exports: [
    SafePipe,
    UIElement,
    LayoutComponent,
    TypographyComponent,
    InputComponent,
    ButtonComponent,
    TableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PrimeNGModule,
    FormsModule,
  ],
  providers: [],
})
export class UIModule {}
