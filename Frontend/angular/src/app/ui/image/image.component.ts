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
      (error)="error($event)"
		/>
	`,
})
export class ImageComponent extends BaseComponent {
  error(event) {
    if (this.uiElement && this.uiElement.error) {
      try {
        eval(this.uiElement.error);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
