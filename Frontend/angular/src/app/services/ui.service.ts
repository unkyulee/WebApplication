import { Injectable } from '@angular/core';
import * as moment from 'moment';

// services
import { ConfigService } from './config.service';
import { RestService } from './rest.service';

@Injectable()
export class UIService {
	constructor(private config: ConfigService, private rest: RestService) {}

	async get(uiElementId) {
		let url = `${this.config.get('host')}${this.config.get('url')}/ui.element`;
		let uiElement: any = await this.rest.requestAsync(url, { uiElementId }, 'get', {}, true);
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
