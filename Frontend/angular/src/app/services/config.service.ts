import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { EventService } from './event.service';
import obj from 'object-path';

// get config from index.html
declare var window: any;

@Injectable()
export class ConfigService {
	constructor(private breakpointObserver: BreakpointObserver, private event: EventService) {
		//
		obj.ensureExists(window, '__CONFIG__', {});

		// event handler
		this.event.onEvent.subscribe(e => this.eventHandler(e));

		// observe screen size changes
		this.checkWindowSize();
	}

	eventHandler(e) {
		if (e.name == 'refresh') {
			this.checkWindowSize();
		}
	}

	// detect window size changes
	public isHandset: boolean;
	checkWindowSize() {
		// observe screen size changes
		if (this.breakpointObserver.isMatched([Breakpoints.Handset])) {
			this.isHandset = true;
		} else {
			this.isHandset = false;
		}
	}

	get(name, def_value?) {
		let v = null;
		if (window.__CONFIG__) v = obj.get(window.__CONFIG__, name, def_value);
		return v;
	}

	set(name, value) {
		// set default if it doesn't exists
		if (!window.__CONFIG__) window.__CONFIG__ = {};
		obj.set(window.__CONFIG__, name, value);
	}

	clear() {
		// this will reset the ui in the configuration
		window.__CONFIG__.ui = {};
		// clear ui cache in the localStorage
		for (var i = 0; i < localStorage.length; i++){
			if(localStorage.key(i).startsWith('http')) {
				localStorage.removeItem(localStorage.key(i))
			}
		}
	}
}
