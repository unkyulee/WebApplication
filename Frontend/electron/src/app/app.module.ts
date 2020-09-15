import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// services
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { EventService } from './services/event.service';
import { ConfigService } from './services/config.service';
import { NavService } from './services/nav.service';
import { UserService } from './services/user/user.service';
import { RestService } from './services/rest.service';
import { AuthService } from './services/auth/auth.service';
import { CordovaService } from './services/cordova.service';
import { DBService } from './services/db/db.service';
import { PermissionService } from './services/permission.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { UtilService } from './services/util.service';
import { UIService } from './services/ui.service';

//
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
		HttpClientJsonpModule,
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
		UtilService,
    PermissionService,
    NgxImageCompressService
	],
  bootstrap: [AppComponent]
})
export class AppModule { }