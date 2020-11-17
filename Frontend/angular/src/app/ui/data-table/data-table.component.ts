import { Component } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import obj from 'object-path';

// user imports
import { BaseComponent } from '../base.component';

@Component({
	selector: 'data-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent extends BaseComponent {
	///
	_rows = [];
	get rows() {
		if (this.data && this.uiElement.key) {
			this._rows = obj.get(this.data, this.uiElement.key);
		}

		if (typeof this._rows != 'undefined' && !Array.isArray(this._rows)) this._rows = [this._rows];

		return this._rows;
	}

	set rows(v: any) {
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

	_selection;
	get selection() {
		return this._selection;
	}
	set selection(item: any) {
		this._selection = item;
	}

	onRowSelect(event) {
		let item = event.data;
		if (obj.get(this.uiElement, 'click')) {
			try {
				eval(this.uiElement.click);
			} catch {}
		}
	}

	onRowUnselect(event) {
		let item = event.data;
		if (obj.get(this.uiElement, 'click')) {
			try {
				eval(this.uiElement.click);
			} catch {}
		}
	}

	// pagination information
	total: number = 0;
	page: number = 0;
	size: number = 0;

	ngOnInit() {
		super.ngOnInit();
		// check if there is any page configuration available
		this.getPage();

		// download data through rest web services
		this.requestDownload();

		// event handler
		this.onEvent = this.event.onEvent.subscribe((event) => this.eventHandler(event));
	}

	eventHandler(event) {
		if (event && (!event.key || event.key == this.uiElement.key)) {
			if (event.name == 'refresh' && (!event.key || event.key == this.uiElement.key)) {
				// run refresh script
				this.page = event.page;
				this.size = event.size;
				if (this.uiElement.refresh) {
					try {
						eval(this.uiElement.refresh);
					} catch (e) {
						console.error(e);
					}
				}
				setTimeout(() => this.requestDownload(), 0);
			} else if (event.name == 'pagination' && (!event.key || event.key == this.uiElement.key)) {
				this.page = event.page;
				this.size = event.size;
				setTimeout(() => this.requestDownload(), 0);
			}
		}
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this.onEvent.unsubscribe();
	}

	//
	onGoingSort = false;
	customSort(event) {
		if (this.onGoingSort) return;

		//
		obj.set(this.uiElement, 'sort', []);

		// add sort filter
		if (event.order == 1) {
			this.uiElement.sort.push({
				dir: 'asc',
				prop: event.field,
			});
		} else if (event.order == -1) {
			this.uiElement.sort.push({
				dir: 'desc',
				prop: event.field,
			});
		}

		//
		this.onGoingSort = true;
		setTimeout(() => this.requestDownload(), 0);
	}

	// Get Pagination information
	getPage() {
		let params = this.nav.getParams();

		// default page is 1
		if (!this.page) {
			this.page = 1;
			// if nav param has page then use it
			if (this.uiElement.externalPaging != false && params['page']) {
				this.page = params['page'];
			}
		}

		// if the page size is determined in the url then use that otherwise use the one from the uiElement
		if (!this.size) {
			this.size = this.uiElement.size ? this.uiElement.size : 10;
			// if nav param has page then use it
			if (this.uiElement.externalPaging != false && params['size']) {
				this.size = params['size'];
			}
		}
	}

	// setting page will set the values to the URL
	setPage(page, size) {
		// save pagination
		this.page = page;
		this.size = size;

		// parameters
		// do not set pagination when card or list
		if (this.uiElement.tableType != 'card' && this.uiElement.tableType != 'list') {
			if (this.uiElement._id) {
				this.nav.setParam('page', this.page);
				this.nav.setParam('size', this.size);
			}
		}
	}

	requestDownload(pageInfo?) {
		// get page
		this.getPage();

		// set pagination
		if (!pageInfo) pageInfo = { offset: this.page - 1 };

		// save the pagination passed by data-table
		this.setPage(pageInfo.offset + 1, this.size);

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
			// apply pagination
			data = Object.assign(data, {
				page: this.page,
				size: this.size,
			});

			// sorting options
			if (this.uiElement.sort) {
				for (let sort of this.uiElement.sort) {
					if (sort.dir == 'asc') data['_sort'] = sort.prop;
					else if (sort.dir == 'desc') data['_sort_desc'] = sort.prop;
				}
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
		} else {
			this.total = this.rows ? this.rows.length : 0;
			this.size = this.total;
		}
	}

	responseDownload(response) {

		// map data from response
		let transform = this.uiElement.transform || 'response.data';
		try {
			this.rows = eval(transform);
		} catch (e) {}

		// get total records
		let transformTotal = this.uiElement.transformTotal || 'response.total';
		try {
			this.total = parseInt(eval(transformTotal));
		} catch (e) {}
		if (this.total != 0 && !this.total) this.total = this.rows.length;

		// hide splash
		this.event.send({ name: 'splash-hide' });
		this.event.send({ name: 'changed' })

		//
		setTimeout(() => {
			this.onGoingSort = false;
		});
	}

	sort: any;
	onSort(event: any) {
		// event.sorts.dir / prop
		this.sort = event.sorts[0];
		if (this.sort) this.requestDownload();
	}

	drop(event: CdkDragDrop<string[]>) {
		if (this.uiElement.drop) {
			try {
				eval(this.uiElement.drop);
			} catch (e) {
				console.error(e);
			}
		}
	}

	filterClick(column) {
		this.event.send({
			name: 'open-dialog',
			data: this.data,
			uiElement: {
				name: column.label,
				toolbar: {
					style: {
						display: "none"
					}
				},
				contentStyle: {
					padding: "24px"
				},
				screens: [column.filter]
			},
			option: obj.get(column.filter, 'option')
		})
	}
}
