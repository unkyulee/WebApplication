import { Injectable } from '@angular/core';
import * as moment from 'moment';

// services
import { ConfigService } from './config.service';
import { RestService } from './rest.service';

@Injectable()
export class UIService {
	constructor(private config: ConfigService, private rest: RestService) {
		this.loadedAt = moment();
	}

	loadedAt: any;

	async get(uiElementId) {
		// check if loadedAt is within 1 hour
		if(moment().add(-1, 'hours') > this.loadedAt) {
			this.loadedAt = moment();
			this.config.set('ui', {}); // clear ui cache
		}

		let uiElement = this.config.get(`ui.${uiElementId}`);
		if(!uiElement) {
			let url = `${this.config.get('host')}${this.config.get('url')}/ui.element`;
			uiElement = await this.rest.requestAsync(url, { uiElementId }, 'get', {}, true);
			this.config.set(`ui.${uiElementId}`, uiElement)
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
