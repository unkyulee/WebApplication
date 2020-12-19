import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutModule } from './layout/layout.module';
import { LayoutComponent } from './layout/layout.component';

// catch-all routes
const appRoutes: Routes = [{ path: '**', component: LayoutComponent }];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    LayoutModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }