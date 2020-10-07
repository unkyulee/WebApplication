import { Component, HostListener } from "@angular/core";
import { BaseComponent } from '../base.component';
import obj from 'object-path';

@Component({
  selector: "icon",
  template: `
    <mat-icon
      [ngStyle]="uiElement.style"
      [ngClass]="uiElement.class"
      [inline]="true"
    >{{uiElement.icon}}</mat-icon>
  `
})
export class IconComponent extends BaseComponent {
  @HostListener('click', [`$event`]) onClick(event) {
		if (obj.has(this.uiElement, 'click')) {
			this.click(event, this.data, this.uiElement.click);
		}
	}
}
