import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { MonacoEditorModule, NgxMonacoEditorConfig } from "ngx-monaco-editor";
import { UIModule } from "./ui/ui.module";

// services
import { AuthInterceptor } from "./services/auth/auth.interceptor";
import { EventService } from "./services/event.service";
import { ConfigService } from "./services/config.service";
import { NavService } from "./services/nav.service";
import { UserService } from "./services/user/user.service";
import { RestService } from "./services/rest.service";
import { AuthService } from "./services/auth/auth.service";
import { CordovaService } from "./services/cordova.service";
import { PermissionService } from "./services/permission.service";
import { NgxImageCompressService } from "ngx-image-compress";
import { UtilService } from "./services/util.service";
import { UIService } from "./services/ui.service";

// locale registration
import { registerLocaleData } from "@angular/common";
import it from "@angular/common/locales/it";
registerLocaleData(it);

// app component
import { AppComponent } from "./app.component";
import { ServiceUrlComponent } from "./loading/service-url/service-url.component";
import { LoginComponent } from "./loading/login/login.component";
import { ErrorComponent } from "./loading/error/error.component";
import { AppRoutingModule } from "./app.routing";

//
const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: "/assets",
};

@NgModule({
  declarations: [
    AppComponent,
    ServiceUrlComponent,
    LoginComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MonacoEditorModule.forRoot(monacoConfig),
    UIModule,
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
    UtilService,
    PermissionService,
    NgxImageCompressService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
