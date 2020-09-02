import { Component } from '@angular/core';
import obj from 'object-path';

// user Imports
import { BaseComponent } from '../base.component';

@Component({
	selector: 'image',
	template: `
		<img
			*ngIf="condition(uiElement)"
			[ngStyle]="uiElement.style"
			[ngClass]="uiElement.class"
			[src]="safeEval(uiElement.src)"
			(click)="click($event)"
		/>
	`,
})
export class ImageComponent extends BaseComponent {
}
