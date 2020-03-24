import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// user imports
import { BaseComponent } from 'src/app/ui/base.component';
import { EventService } from 'src/app/services/event.service';

@Component({
	selector: '[ui-composer-dialog]',
	templateUrl: './ui-composer-dialog.component.html',
	styleUrls: ['./ui-composer-dialog.component.scss'],
})
export class UIComposerDialogComponent extends BaseComponent {
	constructor(public dialogRef: MatDialogRef<UIComposerDialogComponent>) {
		super();

		// save main event service
		this.mainEventService = this.event;
		this.event = new EventService();
	}

	//
	mainEventService;

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
	}

	eventHandler(event) {
		console.log(event);
		if (event.name == 'splash-show') {
			this.showLoadingBar = true;
		} else if (event.name == 'splash-hide') {
			this.showLoadingBar = false;
		}

		// redirect close-dialog, open-dialog
		if (
			['open-dialog', 'close-dialog', 'close-all-dialog', 'open-sheet', 'refresh', 'changed'].includes(event.name)
		) {
      event.event = this.event;
			this.mainEventService.send(event);
		}
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this.onEvent.unsubscribe();
		delete this.event;
	}
}
