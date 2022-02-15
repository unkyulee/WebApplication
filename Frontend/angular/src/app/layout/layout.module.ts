import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// user module
import { UIModule } from "../ui/ui.module";

// user component
import { LayoutComponent } from "./layout.component";

import { ToolbarComponent } from "./toolbar/toolbar.component";
import { NavComponent } from "./navigation/nav.component";
import { UserComponent } from "./user/user.component";
import { PingComponent } from "./ping/ping.component";

@NgModule({
  declarations: [
    LayoutComponent,
    ToolbarComponent,
    NavComponent,
    UserComponent,
    PingComponent,
  ],
  exports: [],
  imports: [CommonModule, UIModule],
})
export class LayoutModule {}
