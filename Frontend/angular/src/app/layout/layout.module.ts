import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// user module
import { UIModule } from "../ui/ui.module";

// user component
import { LayoutComponent } from "./layout.component";

import { ToolbarComponent } from "./toolbar/toolbar.component";
import { NavVerticalComponent } from "./navigation/vertical/nav-vertical.component";
import { NavHorizontalComponent } from "./navigation/horizontal/nav-horizontal.component";
import { SplashComponent } from "./splash/splash.component";
import { LoginComponent } from "./login/login.component";
import { UserComponent } from "./user/user.component";

@NgModule({
  declarations: [
    LayoutComponent,
    ToolbarComponent,
    NavVerticalComponent,
    NavHorizontalComponent,
    SplashComponent,
    LoginComponent,
    UserComponent
  ],
  exports: [],
  imports: [CommonModule, UIModule]
})
export class LayoutModule {}
