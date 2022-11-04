import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../plugins/material.module";

import { LoadingComponent } from "./loading.componnent";
import { SafePipe } from "../plugins/safe.pipe";

@NgModule({
  declarations: [LoadingComponent, SafePipe],
  imports: [CommonModule, MaterialModule],
  exports: [LoadingComponent],
})
export class LoadingModule {}
