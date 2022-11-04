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
import { UserService } from "./services/user/user.service";
import { PermissionService } from "./services/permission.service";
import { UIService } from "./services/ui.service";
import { WebSocketService } from "./services/websocket.service";

/*
import { NgxImageCompressService } from "ngx-image-compress";

*/

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoadingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    UtilService,
    RestService,
    ConfigService,
    EventService,
    AuthService,
    UserService,
    NavService,
    UIService,
    WebSocketService,
    PermissionService,
    //NgxImageCompressService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
