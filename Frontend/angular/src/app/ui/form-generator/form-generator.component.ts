import { Component, Input } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
var obj = require('object-path');

// user imports
import { BaseComponent } from '../base.component';

@Component({
	selector: 'form-generator',
	templateUrl: './form-generator.component.html',
})
export class FormGeneratorComponent extends BaseComponent {
	_data: any;
	@Input()
	get data() {
		return this._data;
	}
	set data(v: any) {
		this._data = v;
	}

	// event subscription
	ngOnInit() {
		super.ngOnInit();
		// download data
		this.requestDownload(this.uiElement.cached != false);

		// subscript to event
		this.onEvent = this.event.onEvent.subscribe(event => this.eventHandler(event));
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this.onEvent.unsubscribe();
	}

	eventHandler(event) {
		if (event && event.name == 'refresh' && (!event.key || event.key == this.uiElement.key)) {
			// run refresh script
			if (this.uiElement.refresh) {
				try {
					eval(this.uiElement.refresh);
				} catch (e) {
					console.error(e);
				}
			}
			this.requestDownload(false);
		} else if (event && event.name == 'merge-data' && (!event.key || event.key == this.uiElement.key)) {
			this.data = Object.assign(this.data, event.data);
		} else if (event && event.name == 'insert-data' && (!event.key || event.key == this.uiElement.key)) {
			obj.ensureExists(this.data, event.path, []);
			let data = obj.get(this.data, event.path);
			if (!data) data = [];

			if (data.indexOf(event.data) > -1) {
				// if exists then do nothing - it's already there
			} else if (event.datakey && data.find(item => item[event.datakey] == event.data[event.datakey])) {
				let found = data.find(item => item[event.datakey] == event.data[event.datakey]);
				if (found) {
					// item found - replace it
					let index = data.indexOf(found);
					data[index] = event.data;
				}
			} else {
				// if not exists then add
				obj.push(this.data, event.path, event.data);
				obj.set(this.data, event.path, JSON.parse(JSON.stringify(obj.get(this.data, event.path))));
			}
		} else if (event && event.name == 'delete-data' && (!event.key || event.key == this.uiElement.key)) {
			let data = obj.get(this.data, event.path);
			if (data) {
				if (data.indexOf(event.data) > -1) {
					// delete data
					data.splice(data.indexOf(event.data), 1);
				} else if (event.datakey && data.find(item => item[event.datakey] == event.data[event.datakey])) {
					let found = data.find(item => item[event.datakey] == event.data[event.datakey]);
					if (found) {
						// item found - delete it
						data.splice(data.indexOf(found), 1);
					}
				}
			}
		} else if (event && event.name == 'save' && (!event.key || event.key == this.uiElement.key)) {
			this.save();
		} else if (event && event.name == 'delete' && (!event.key || event.key == this.uiElement.key)) {
			this.delete();
		} else if (event && event.name == 'open-section') {
			let section = this.uiElement.screens.find(x => x.key == event.key);
			if (section) section.expanded = true;
		} else if (event && event.name == 'open-all-section') {
      for(let section of this.uiElement.screens) {
        section.expanded = true;
      }
		} else if (event && event.name == 'close-section') {
			let section = this.uiElement.screens.find(x => x.key == event.key);
			if (section) section.expanded = false;
		} else if (event && event.name == 'close-all-section') {
			for(let section of this.uiElement.screens) {
        section.expanded = false;
      }
		}
	}

	requestDownload(cached?) {
		// retrieve REST information
		let src = this.uiElement.src;
		try {
			src = eval(src);
		} catch (e) {}

		if (src) {
			let method = this.uiElement.method;
			let data = this.uiElement.data;
			try {
				data = eval(data);
			} catch (e) {}

			// download data through rest web services
			// start the splash
			this.event.send({ name: 'splash-show' });
			this.rest
				.request(src, data, method, {}, cached)
				.pipe(
					catchError(err => {
						// hide the splash
						this.event.send({ name: 'splash-hide' });
						//
						if (this.uiElement.errorAction) {
							try {
								eval(this.uiElement.errorAction);
							} catch (e) {
								console.error(e);
							}
						} else alert(JSON.stringify(err));

						return EMPTY;
					})
				)
				.subscribe(response => this.responseDownload(response));
		}
	}

	responseDownload(response) {
		// hide the splash
		this.event.send({ name: 'splash-hide' });

		// go through data transformation
		let data = {};
		if (this.uiElement.transform) {
			try {
				// do not overwrite data
				data = eval(this.uiElement.transform);
			} catch (e) {
				console.error(e);
			}
		} else data = response;

		// do not overwrite existing data
		this.data = Object.assign({}, this.data, data);

		// send event that the data is refreshed
		this.event.send({ name: 'refreshed' });
	}

	async save() {
		// check if there are not error
		let errorMessage = '';
		for (let screen of this.uiElement.screens) {
			for (let ui of screen.screens) {
				let value = this.data[ui.key]; // used by the evaluation script
				let error = eval(ui.errorCondition);
				if (error) {
					errorMessage += `${ui.errorMessage}\n`;
				}
			}
		}
		if (errorMessage) {
			alert(errorMessage);
			return;
		}

		// beforeSave
		if(obj.get(this.uiElement, 'beforeSave')) {
			try {
				await eval(obj.get(this.uiElement, 'beforeSave'))
			} catch(e) {
				console.error(e)
			}
		}

		// retrieve REST information
		let src = obj.get(this.uiElement, 'save.src');
		try {
			src = eval(src);
		} catch (e) {}
		let method = obj.get(this.uiElement, 'save.method', 'post');
		try {
			method = eval(method);
		} catch {}

		// see if any transform to be done
		let data = { ...this.data };
		// remove _params_
		delete data._params_;
		if (obj.has(this.uiElement, 'save.transform')) {
			try {
				eval(this.uiElement.save.transform);
			} catch (e) {
				console.error(e);
			}
		}

		// update data through rest web services
		if (src) {
			// hide the splash
			this.event.send({ name: 'splash-show' });

			this.rest
				.request(src, data, method)
				.pipe(
					catchError(err => {
						// hide the splash
						this.event.send({ name: 'splash-hide' });

						// save failed
						let errorAction = obj.get(this.uiElement, 'save.errorAction');
						if (errorAction) {
							try {
								eval(errorAction);
							} catch (e) {
								console.error(e);
							}
						} else alert(JSON.stringify(err));

						return EMPTY;
					})
				)
				.subscribe(response => this.saveAction(response));
		} else {
			// hide splash
			this.event.send({ name: 'splash-hide' });
		}
	}

	saveAction(response) {
		// hide the splash
		this.event.send({ name: 'splash-hide' });

		let saveAction = obj.get(this.uiElement, 'save.saveAction');
		if (saveAction)
			try {
				eval(saveAction);
			} catch (e) {
				console.error(e);
			}
		else {
			// check if the response has error
			if (response && response.error) {
				this.snackBar.open(response.error, null, { duration: 2000 });
			} else {
				this.snackBar.open('Saved', null, { duration: 2000 });
			}
		}
	}

	delete() {
		if (this.uiElement.delete) {
			// service setup
			let src = this.uiElement.delete.src;
			try {
				src = eval(src);
			} catch (e) {}
			let method = this.uiElement.delete.method;

			// download data through rest web services
			this.rest.request(src, null, method).subscribe(response => this.deleteAction());
		}
	}

	deleteAction() {
		// back to list
		if (this.uiElement.delete.deleteAction) {
			try {
				eval(this.uiElement.delete.deleteAction);
			} catch (e) {
				console.error(e);
			}
		} else {
			this.nav.back();
		}
	}

	condition(uiElement) {
		let result = true;
		if (uiElement && uiElement.condition) {
			try {
				result = eval(uiElement.condition);
			} catch (e) {
				console.error(uiElement.condition, e);
				result = false;
			}
		}
		return result;
	}
}
