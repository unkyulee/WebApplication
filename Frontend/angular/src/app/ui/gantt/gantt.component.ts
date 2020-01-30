import { Component, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../base.component';
var obj = require('object-path');

// gantt
import 'dhtmlx-gantt';

@Component({
	selector: 'gantt',
	templateUrl: 'gantt.component.html'
})
export class GanttComponent extends BaseComponent {
	@ViewChild('ganttContainer', { static: false }) ganttContainer: ElementRef;

	///
	_tasks;
	get tasks() {
		if (this.data && this.uiElement.key) {
			this._tasks = obj.get(this.data, this.uiElement.key, []);
		}

		if (typeof this._tasks != 'undefined' && !Array.isArray(this._tasks)) this._tasks = [this._tasks];

		return this._tasks;
	}

	set tasks(v: any) {
		if (this.data && this.uiElement.key) {
			obj.set(this.data, this.uiElement.key, v);
		}

		// set default when value is empty
		if (!v && this.uiElement.key && this.uiElement.default) {
			v = this.uiElement.default;
			try {
				v = eval(this.uiElement.default);
			} catch (e) {
				console.error(e);
			}
			obj.set(this.data, this.uiElement.key, v);
		}

		// set value to gantt
		gantt.clearAll();
		gantt.parse({ data: v });
	}

	ngOnInit() {
		super.ngOnInit();

		// subscript to event
		this.onEvent = this.event.onEvent.subscribe(event => {
			if (event && event.name == 'tasks') {
				this.tasks = event.tasks;
			}
		});
	}

	ngAfterViewInit() {
		super.ngAfterViewInit();

		// init Gantt
		gantt.init(this.ganttContainer.nativeElement);

		// setup locale
		if (this.uiElement.locale) {
			gantt.locale = this.uiElement.locale;
		}

		// config - scale
		if (this.uiElement.scales) {
			gantt.config.scales = this.uiElement.scales;
		}

		if (this.uiElement.duration_unit) {
			gantt.config.duration_unit = this.uiElement.duration_unit;
    }

    if(this.uiElement.columns) {
      gantt.config.columns = this.uiElement.columns;
    }
	}
}
