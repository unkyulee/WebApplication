import { Component, ViewChild } from '@angular/core';
var obj = require('object-path');

import { BaseComponent } from '../base.component';
import { jqxEditorComponent } from 'jqwidgets-ng/jqxeditor';

@Component({
	selector: 'editor',
	templateUrl: './editor.component.html',
})
export class EditorComponent extends BaseComponent {
	constructor() {
		super();
	}

	@ViewChild('editorReference', { static: false }) editorReference: jqxEditorComponent;

	_data;
	get data() {
		return this._data;
	}
	set data(v) {
		this._data = v;
		// retrieve value
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
      if(this.editorReference) {
        this.editorReference.val(obj.get(this.data, this.uiElement.key));
      }
		}
	}

	ngAfterViewInit() {
		super.ngAfterViewInit();

		// retrieve value
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
      if(this.editorReference) {
        this.editorReference.val(obj.get(this.data, this.uiElement.key));
      }
		}
	}

	onChanged() {
		if (this.uiElement.key) {
			obj.set(this.data, this.uiElement.key, this.editorReference.val());
		}
	}
}
