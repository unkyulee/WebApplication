import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { EventService } from '../../../../angular/src/app/services/event.service';

//const Store = {} //require('electron-store');


// get config from index.html
declare var window: any;

@Injectable()
export class ConfigService {
  store

	constructor(private breakpointObserver: BreakpointObserver, private event: EventService) {
		this.store = {}//new Store();
	}

	get(name, def_value?) {
		let value = this.store.get(name);
		if (typeof value == 'undefined') value = def_value;
		return value;
	}

	set(name, value) {
		if (typeof name == 'object') {
			this.store.set(name);
		} else if(value) {
			this.store.set(name, value);
		}
	}

	clear() {
		this.store.clear();
	}
}
