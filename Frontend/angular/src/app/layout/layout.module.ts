import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../core/material.module";

// user module
import { UIModule } from "../ui/ui.module";

// user component
import { LayoutComponent } from "./layout.component";

import { ToolbarComponent } from "./toolbar/toolbar.component";
import { NavVerticalComponent } from "./navigation/vertical/nav-vertical.component";
import { SplashComponent } from "./splash/splash.component";
import { LoginComponent } from "./login/login.component";
import { UserComponent } from "./user/user.component";

@NgModule({
  declarations: [
    LayoutComponent,
    ToolbarComponent,
    NavVerticalComponent,
    SplashComponent,
    LoginComponent,
    UserComponent
  ],
  exports: [],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, UIModule]
})
export class LayoutModule {}
