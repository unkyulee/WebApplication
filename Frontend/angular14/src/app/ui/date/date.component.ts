import { Component } from '@angular/core';
import obj from 'object-path';
import * as moment from 'moment';

import { BaseComponent } from '../base.component';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
	selector: 'date',
	templateUrl: './date.component.html',
	providers: [
		// `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
		// `MatMomentDateModule` in your applications root module. We provide it at the component level
		// here, due to limitations of our example generation script.
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
	],
})
export class DateComponent extends BaseComponent {
	constructor(private dateAdapter: DateAdapter<Date>) {
		super();
	}

	ngOnInit() {
		super.ngOnInit();

		// set locate
		this.dateAdapter.setLocale(this.uiElement.locale ? this.uiElement.locale : this.config.get('locale'));
	}

	ngOnDestroy() {
		super.ngOnDestroy();
	}

	_value: any;
	get value() {
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
			if (obj.get(this.data, this.uiElement.key)) {
				if (this.uiElement.dateType == 'time') {
					this._value = moment(obj.get(this.data, this.uiElement.key)).format('HH:mm');
				} else {
					this._value = moment(obj.get(this.data, this.uiElement.key)).format('YYYY-MM-DDTHH:mm');
				}
			}
		}

		// Transform
		if (this.uiElement.transform) {
			try {
        this._value = eval(this.uiElement.transform);                
			} catch (e) {
        console.error(e, this.uiElement)
      }
		}

		return this._value;
	}

	set value(v: any) {
		this._value = v;
		if (this.data && this.uiElement.key) {

			if (this.uiElement.dateType == 'time') {
				// HH:mm format will be given and should be converted
				let d = obj.get(this.data, this.uiElement.key);
				d = new Date(obj.get(this.data, this.uiElement.dateKey, null));
				let newDate = moment(v, 'HH:mm a').toDate();

				d.setHours(newDate.getHours());
				d.setMinutes(newDate.getMinutes());

				v = d;
			}

			obj.set(this.data, this.uiElement.key, moment(v));
		}

		// see if there are any input change handlers
		if (this.uiElement.changed) {
			try {
				eval(this.uiElement.changed);
			} catch (ex) {
				console.error(ex);
			}
		}
	}
}
