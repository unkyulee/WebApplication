import "hammerjs"; // to support touch gestures
import { NgModule } from "@angular/core";
import {
  HttpClientModule,
  HttpClientJsonpModule,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from "./core/material.module";
import { MonacoEditorModule } from "ngx-monaco-editor";

// services
import { AuthInterceptor } from "./services/auth/auth.interceptor";
import { EventService } from "./services/event.service";
import { ConfigService } from "./services/config.service";
import { NavService } from "./services/nav.service";
import { UserService } from "./services/user/user.service";
import { RestService } from "./services/rest.service";
import { AuthService } from "./services/auth/auth.service";
import { CordovaService } from "./services/cordova.service";
import { DBService } from "./services/db/db.service";
import { ExportService } from "./services/export.service";
import { PermissionService } from "./services/permission.service";

// modules
import { LayoutModule } from "./layout/layout.module";
import { UIModule } from "./ui/ui.module";

// app component
import { AppComponent } from "./app.component";
import { LayoutComponent } from "./layout/layout.component";
import { SoundService } from "./services/sound.service";
import { UIService } from "./services/ui.service";

// catch-all routes
const appRoutes: Routes = [{ path: "**", component: LayoutComponent }];

// locale registration
import { registerLocaleData } from '@angular/common';
import it from '@angular/common/locales/it';
registerLocaleData(it);

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    HttpClientJsonpModule,
    MaterialModule,
    MonacoEditorModule.forRoot(),
    RouterModule.forRoot(
      appRoutes
      //, {enableTracing: true}
    ),
    LayoutModule,
    UIModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    EventService,
    ConfigService,
    UserService,
    NavService,
    UIService,
    RestService,
    CordovaService,
    DBService,
    ExportService,
    SoundService,
    PermissionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
