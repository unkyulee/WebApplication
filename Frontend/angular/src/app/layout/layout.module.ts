import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { MaterialModule } from '../core/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

// user module
import { UIModule } from '../ui/ui.module';

// user component
import { LayoutComponent } from './layout.component';
import { UIComposerComponent } from './ui-composer/ui-composer.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { NavVerticalComponent } from './navigation/vertical/nav-vertical.component';
import { SplashComponent } from './splash/splash.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { UIComposerOverlayComponent } from './ui-composer-overlay/ui-composer-overlay.component';
import { UIComposerPrintComponent } from './ui-composer-print/ui-composer-print.component';

@NgModule({
  declarations: [
    LayoutComponent
    , UIComposerComponent
    , UIComposerOverlayComponent
    , UIComposerPrintComponent
    , ToolbarComponent
    , WorkflowComponent
    , NavVerticalComponent
    , UserComponent
    , SplashComponent
    , LoginComponent
  ]
  , exports: [
  ]
  , imports: [
    CommonModule
    , RouterModule
    , FlexLayoutModule
    , FormsModule
    , MaterialModule
    , UIModule
    , EcoFabSpeedDialModule
  ],
  entryComponents: [
    UIComposerOverlayComponent
  ]
})

export class LayoutModule {}
