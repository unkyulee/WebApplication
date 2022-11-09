import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "./app.routing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthInterceptor } from "./services/auth/auth.interceptor";
import { AppComponent } from "./app.component";
import { LoadingModule } from "./loading/loading.module";

import { UtilService } from "./services/util.service";
import { RestService } from "./services/rest.service";
import { ConfigService } from "./services/config.service";
import { EventService } from "./services/event.service";
import { AuthService } from "./services/auth/auth.service";
import { NavService } from "./services/nav.service";
import { UIService } from "./services/ui.service";
import { LayoutModule } from "@angular/cdk/layout";

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoadingModule,
    LayoutModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    UtilService,
    RestService,
    ConfigService,
    EventService,
    AuthService,
    NavService,
    UIService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
