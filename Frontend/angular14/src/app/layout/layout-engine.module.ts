import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../plugins/material.module";
import { PrimeNGModule } from "../plugins/primeng.module";
import { UIModule } from "../ui/ui.module";
import { LayoutEngineComponent } from "./layout-engine.component";
import { DialogComponent } from "./overlay/dialog/dialog.component";
import { OverlayComponent } from "./overlay/overlay.component";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { TopMenuComponent } from "./top-menu/top-menu.component";

@NgModule({
  declarations: [
    LayoutEngineComponent,
    SideNavComponent,
    TopMenuComponent,
    OverlayComponent,
    DialogComponent,
  ],
  exports: [],
  imports: [CommonModule, MaterialModule, PrimeNGModule, FormsModule, UIModule],
  entryComponents: [DialogComponent],
})
export class LayoutModule {}
