import { Component, HostListener } from '@angular/core';
import obj from 'object-path';

// user Imports
import { BaseComponent } from '../base.component';

@Component({
	selector: 'ui-layout',
	template: `
		<ng-container *ngFor="let ui of uiElement.screens">
			<ng-container *ngIf="condition(ui)">
				<div ui-layout-wrapper [uiElement]="ui" [data]="data"></div>
			</ng-container>
		</ng-container>
	`,
})
export class UILayoutComponent extends BaseComponent {
	@HostListener('click', [`$event`]) onClick(event) {
		if (obj.has(this.uiElement, 'click')) {
			this.click(event, this.data, this.uiElement.click);
		}
	}
}
