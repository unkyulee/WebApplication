import { Component } from '@angular/core';
import { BaseComponent } from '../base.component';
import obj from 'object-path';

@Component({
	selector: 'tree',
	templateUrl: `./tree.component.html`,
})
export class TreeComponent extends BaseComponent {
	///
	_tree = [];
	get tree() {
		if (this.data && this.uiElement.key) {
			this._tree = obj.get(this.data, this.uiElement.key, []);
		}

		return this._tree;
	}

	set tree(v: any) {
		if (this.data && this.uiElement.key) {
			obj.set(this.data, this.uiElement.key, v);
		}

		// set default when value is empty
		if (!v && this.uiElement.key && this.uiElement.default) {
			let defaultValue = this.uiElement.default;
			try {
				defaultValue = eval(this.uiElement.default);
			} catch (e) {
				console.error(e);
			}
			obj.set(this.data, this.uiElement.key, defaultValue);
		}
	}

	ngOnInit() {
		super.ngOnInit();

		// download data through rest web services
		this.requestDownload();
	}

	requestDownload() {
		// download data through rest web services
		let src = this.uiElement.src;
		if (src) {
			try {
				src = eval(src);
			} catch (e) {
				console.error(e);
			}

			// look at query params and pass it on to the request
			let data = this.uiElement.data;
			// apply nav parameters if necessary
			if (this.uiElement.useNavParams != false) {
				let params = this.nav.getParams();
				delete params['_id'];
				data = Object.assign({}, data, params);
			}

			let options = {};
			if (this.uiElement.options) {
				options = this.uiElement.options;
				try {
					options = eval(`${options}`);
				} catch {}
			}

			if (this.uiElement.preProcess) {
				try {
					eval(this.uiElement.preProcess);
				} catch (e) {
					console.error(e);
				}
			}

			// send REST request
			this.event.send({ name: 'splash-show' }); // show splash
			this.rest
				.request(src, data, this.uiElement.method, options, this.uiElement.cached)
				.subscribe((response) => this.responseDownload(response));
		}
	}

	responseDownload(response) {
		// hide splash
		this.event.send({ name: 'splash-hide' });

		// map data from response
		let transform = this.uiElement.transform || 'response.data';
		try {
			this.tree = eval(transform);
		} catch (e) {}
	}
}
