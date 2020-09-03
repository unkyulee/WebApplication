import { Component, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import obj from 'object-path';

import { BaseComponent } from '../base.component';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
	selector: 'input-component',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class InputComponent extends BaseComponent {
	constructor(private dateAdapter: DateAdapter<Date>) {
		super();
	}

	//
	typeAheadEventEmitter = new Subject<string>();
	@ViewChild('datetimepicker_target') datetimepicker: ElementRef;

	ngOnInit() {
		super.ngOnInit();

		// not all the input will be sent as an event / rest
		// will be debounced every 700 ms
		this.typeAheadEventEmitter
			.pipe(distinctUntilChanged(), debounceTime(300))
			.subscribe((v) => this.inputChanged(v));

		// subscript to event
		this.onEvent = this.event.onEvent.subscribe((event) => this.eventHandler(event));

		// set locate
		this.dateAdapter.setLocale(this.uiElement.locale ? this.uiElement.locale : this.config.get('locale'));
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this.typeAheadEventEmitter.unsubscribe();
	}

	eventHandler(event) {
		if (event && event.name == 'datepicker-trigger' && event.key == this.uiElement.key && this.datetimepicker) {
			this.datetimepicker.nativeElement.click();
		}
	}

	inputChanged(v) {
		// see if there are any input change handlers
		if (this.uiElement.changed) {
			try {
				eval(this.uiElement.changed);
			} catch (ex) {
				console.error(ex);
			}
		}
	}

	_value: any;
	get value() {
		// do not set value if it is password
		if (this.uiElement.inputType == 'password') return;

		if (this.data && this.uiElement.key) {
			// if null then assign default
			if (typeof obj.get(this.data, this.uiElement.key) == 'undefined') {
				let def = this.uiElement.default;
				try {
					def = eval(this.uiElement.default);
				} catch (e) {}
				obj.set(this.data, this.uiElement.key, def);
			}

			// set value
			this._value = obj.get(this.data, this.uiElement.key);
		}

		// Transform
		if (this.uiElement.transform) {
			try {
				this._value = eval(this.uiElement.transform);
			} catch (e) {}
		}

		// if number
		if (this._value && this.uiElement.inputType == 'number') this._value = parseFloat(this._value);

		return this._value;
	}

	set value(v: any) {
		this._value = v;

		if (this.data && this.uiElement.key) {
			obj.set(this.data, this.uiElement.key, v);
			// if number
			if (v && this.uiElement.inputType == 'number') obj.set(this.data, this.uiElement.key, parseFloat(v));
		}

		this.typeAheadEventEmitter.next(v);
	}
}
