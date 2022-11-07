import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LayoutEngineComponent } from "./layout/layout-engine.component";
import { LayoutModule } from "./layout/layout-engine.module";

const routes: Routes = [{ path: "**", component: LayoutEngineComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes), LayoutModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
