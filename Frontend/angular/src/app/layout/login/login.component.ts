import { Component } from '@angular/core';
import obj from 'object-path';

// user imports
import { BaseComponent } from '../../ui/base.component';

// get config from index.html
declare var window: any;

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent {

	async ngOnInit() {
		obj.ensureExists(this, 'data', {});
		obj.ensureExists(this, 'uiElement', {});

		// load uielement
		this.load();

		// handle events
		this.onEvent = this.event.onEvent.subscribe(async (event) => {
			if (event.name == 'login') {
				if (event.data) this.data = Object.assign(this.data, event.data);
				await this.authenticate();
			} else if(event.name == 'load') {
				this.load()
			}
		});
	}

	ngOnDestroy() {
		this.onEvent.unsubscribe();
	}

	load() {
		// retreive login screen
		if (this.config.get('url')) {
			this.rest.request(`${this.config.get('url')}/login.config`).subscribe((r) => {
				this.uiElement = r;
				this.event.send({name: 'changed'})
			});
		}
	}

	service_url;
	register() {
		if(this.util.isElectron()) {
			window.registerService(this.service_url);
			window.loadConfig(this.service_url);
		}
	}

	// login
	async authenticate() {
		// try login
		this.event.send({ name: 'splash-show' }); // show splash
		try {
			// remove error message from the data
			delete this.data.error;
			// clear localstorage
			localStorage.clear();
			// try login
			await this.auth.login(this.data);
		} catch (e) {
			// login error
			let message = obj.get(this.uiElement, `errors.${e.status}`, e.message);
			this.data.error = message;
		} finally {
			this.event.send({ name: 'splash-hide' }); // hide splash
		}
	}
}
