import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { EventService } from './event.service';
var obj = require('object-path');

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

		// also clear the localStorage
		let token = localStorage.getItem('token');
		localStorage.clear();
		localStorage.setItem('token', token);
	}
}
