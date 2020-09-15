import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

// modules
import { UIModule } from './ui/ui.module';

// app component
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

// locale registration
import { registerLocaleData } from '@angular/common';
import it from '@angular/common/locales/it';
registerLocaleData(it);

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserAnimationsModule,
		HttpClientModule,
		HttpClientJsonpModule,
		AppRoutingModule,
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
		DBService,
		UtilService,
    PermissionService,
    NgxImageCompressService
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
