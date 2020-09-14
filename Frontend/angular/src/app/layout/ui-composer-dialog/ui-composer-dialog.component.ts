import { Component, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// user imports
import { BaseComponent } from '../../ui/base.component';

@Component({
	selector: '[ui-composer-dialog]',
	templateUrl: './ui-composer-dialog.component.html',
	styleUrls: ['./ui-composer-dialog.component.scss'],
})
export class UIComposerDialogComponent extends BaseComponent {
	constructor(public dialogRef: MatDialogRef<UIComposerDialogComponent>, public ref: ChangeDetectorRef) {
		super();
	}

	// showLoadingBar
	showLoadingBar: boolean = false;
	isDialog: boolean = true;

	ngOnInit() {
		super.ngOnInit();

		// subscript to event
		this.onEvent = this.event.onEvent.subscribe(event => this.eventHandler(event));
	}

	ngAfterViewInit() {
		super.ngAfterViewInit();
		setTimeout(() => this.cordova.detectChanges(this.ref), 2000);
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this.onEvent.unsubscribe();
	}

	eventHandler(event) {
		if (event.name == 'splash-show') {
			this.showLoadingBar = true;
		} else if (event.name == 'splash-hide') {
			this.showLoadingBar = false;
		} else if (event.name == 'changed') {
			this.cordova.detectChanges(this.ref);
		}
	}
}
