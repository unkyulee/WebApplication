import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs'; // to support touch gestures
import { MaterialModule } from './core/material.module';

// services
import { AuthInterceptor } from './services/auth.interceptor';
import { EventService } from './services/event.service';
import { ConfigService } from './services/config.service';
import { NavService } from './services/nav.service';
import { UserService } from './services/user.service';
import { UIService } from './services/ui.service';
import { RestService } from './services/rest.service';
import { AuthService } from './services/auth.service';

// modules
import { LayoutModule } from './layout/layout.module';
import { UIModule } from './ui/ui.module';

// app component
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';

// catch-all routes
const appRoutes: Routes = [
    { path: '**', component: LayoutComponent }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule
        , BrowserAnimationsModule
        , HttpClientModule
        , MaterialModule
        , RouterModule.forRoot(
            appRoutes
            //, {enableTracing: true}
        )
        , LayoutModule
        , UIModule
    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      , AuthService
      , EventService
      , ConfigService
      , UserService
      , NavService
      , UIService
      , RestService
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {}
