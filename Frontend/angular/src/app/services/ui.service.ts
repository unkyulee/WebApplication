import { Injectable, isDevMode } from '@angular/core';
import * as moment from 'moment';

// services
import { ConfigService } from './config.service';
import { RestService } from './rest.service';
import { NavService } from './nav.service';

// get config from index.html
declare var window: any;

@Injectable()
export class UIService {
	constructor(private config: ConfigService, private rest: RestService, private nav: NavService) {
		// save the point in time to trigger the next refresh
		this.loadedAt = moment();
	}

	loadedAt: any;

	async get(uiElementId) {
		// check if loadedAt is within 6 hour
		if (moment().add(-6, 'hours') > this.loadedAt || window.dev == true) {
			this.loadedAt = moment();

			// reset configuration
			this.config.clear(); // clear ui cache

			// request the app
			this.nav.loadNavigation();
		}

		let uiElement = this.config.get(`ui.${uiElementId}`);
		if (!uiElement) {
			// use cache when offline
			let cache = !navigator.onLine;

			let url = `${this.config.get('host')}${this.config.get('url')}/ui.element`;
			uiElement = await this.rest.requestAsync(url, { uiElementId }, 'get', {}, cache);
			this.config.set(`ui.${uiElementId}`, uiElement);
		}

		// run load script
		if (uiElement) {
			if (uiElement.load) {
				try {
					eval(uiElement.load);
				} catch (e) {
					console.error(e);
				}
			}
		}

		return uiElement;
	}

	clear() {
		this.config.set('ui', {});
	}
}
