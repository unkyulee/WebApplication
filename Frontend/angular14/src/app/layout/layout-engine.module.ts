import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../plugins/material.module";
import { PrimeNGModule } from "../plugins/primeng.module";
import { UIModule } from "../ui/ui.module";
import { LayoutEngineComponent } from "./layout-engine.component";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { TopMenuComponent } from "./top-menu/top-menu.component";
import { OverlayComponent } from "./overlay/overlay.component";
import { DialogComponent } from "./overlay/dialog/dialog.component";
import { ActionSheetComponent } from "./overlay/actions-sheet/action-sheet.component";
import { SnackbarComponent } from "./overlay/snackbar/snackbar.component";
import { PingComponent } from "./overlay/ping/ping.component";
import { ErrorDialogService } from "./overlay/error/error-dialog.service";
import { ErrorDialogComponent } from "./overlay/error/error-dialog.component";
import { ConfirmComponent } from "./overlay/confirm/confirm.component";
import { ConfirmationService } from "primeng/api";

@NgModule({
  declarations: [
    LayoutEngineComponent,
    SideNavComponent,
    TopMenuComponent,
    OverlayComponent,
    DialogComponent,
    ActionSheetComponent,
    SnackbarComponent,
    PingComponent,
    ErrorDialogComponent,
    ConfirmComponent,
  ],
  exports: [],
  imports: [CommonModule, MaterialModule, PrimeNGModule, FormsModule, UIModule],
  providers: [ErrorDialogService, ConfirmationService],
  entryComponents: [DialogComponent],
})
export class LayoutModule {}
