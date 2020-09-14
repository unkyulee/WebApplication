import { NgModule } from "@angular/core";

// user module
import { UIModule } from "../../../../angular/src/app/ui/ui.module";

// user component
import { LayoutComponent } from "./layout.component";
/*
import { UIComposerComponent } from "./ui-composer/ui-composer.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { NavVerticalComponent } from "./navigation/vertical/nav-vertical.component";
import { SplashComponent } from "./splash/splash.component";
import { LoginComponent } from "./login/login.component";
import { UIComposerDialogComponent } from "./ui-composer-dialog/ui-composer-dialog.component";
import { UIComposerActionsComponent } from "./ui-composer-actions/ui-composer-actions.component";
import { UserComponent } from "./user/user.component";
*/

@NgModule({
  declarations: [
    LayoutComponent,
    /*
    UIComposerComponent,
    UIComposerDialogComponent,
    UIComposerActionsComponent,
    ToolbarComponent,
    NavVerticalComponent,
    SplashComponent,
    LoginComponent,
    UserComponent
    */
  ],
  exports: [],
  imports: [UIModule],
  entryComponents: [
    /*
    UIComposerDialogComponent,
    UIComposerActionsComponent
    */
  ]
})
export class LayoutModule {}
