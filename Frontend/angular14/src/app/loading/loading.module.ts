import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../plugins/material.module";

import { LoadingComponent } from "./loading.componnent";
import { ServiceRegistrationComponent } from "./registration/registration.component";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { UIModule } from "../ui/ui.module";

@NgModule({
  declarations: [
    LoadingComponent,
    ServiceRegistrationComponent,
    LoginComponent,
  ],
  imports: [CommonModule, MaterialModule, FormsModule, UIModule],
  exports: [LoadingComponent],
})
export class LoadingModule {}
