import { Injectable } from '@angular/core';
import * as moment from 'moment';

// services
import { ConfigService } from './config.service';
import { RestService } from './rest.service';

@Injectable()
export class UIService {
	constructor(private config: ConfigService, private rest: RestService) {}
	loadedAt: any = {};

	async get(uiElementId) {
		let uiElement = this.config.get(`ui.${uiElementId}`);
		if (
			// if uiElement doesn't exist
			!uiElement ||
			// of  if the uiElement is too old
			(this.loadedAt[uiElementId] && this.loadedAt[uiElementId] < moment().add(-1, 'hour'))
		) {
			// then reload the uiElement
			let url = `${this.config.get('host')}${this.config.get('url')}/ui.element`;
			uiElement = await this.rest.requestAsync(url, { uiElementId }, 'get', {}, true);
			if (uiElement) {
				if (uiElement.load) {
					try {
						eval(uiElement.load);
					} catch (e) {
						console.error(e);
					}
				}
				this.config.set(`ui.${uiElementId}`, uiElement);
				this.loadedAt[uiElementId] = new Date();
			}
		}

		return uiElement;
	}

	clear() {
		this.loadedAt = {};
		this.config.set('ui', {});
	}
}
