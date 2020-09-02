import { Component, ViewChild } from '@angular/core';
var obj = require('object-path');

import { BaseComponent } from '../base.component';

import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import Quill from 'quill'

@Component({
	selector: 'editor',
	templateUrl: './editor.component.html',
})
export class EditorComponent extends BaseComponent {
	constructor() {
		super();
	}

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
		}
	}

	blurred = false
  focused = false

	created(event: Quill) {
    // tslint:disable-next-line:no-console
    console.log('editor-created', event)
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    console.log('editor-change', event)
  }

  focus($event) {
    // tslint:disable-next-line:no-console
    console.log('focus', $event)
    this.focused = true
    this.blurred = false
  }

  blur($event) {
    // tslint:disable-next-line:no-console
    console.log('blur', $event)
    this.focused = false
    this.blurred = true
  }

}
