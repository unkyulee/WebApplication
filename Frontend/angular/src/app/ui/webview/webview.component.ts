import { Component } from '@angular/core';

// user Imports
import { BaseComponent } from '../base.component';

@Component({
	selector: 'webview-component',
	template: `
  <webview
    attr.useragent="{{uiElement.useragent}}"
    attr.partition="{{uiElement.partition?uiElement.partition:'persist:default'}}"
    attr.src="{{uiElement.src?uiElement.src: '_blank'}}"
    attr.id="{{uiElement.id}}"
    [ngStyle]="uiElement.style"
    [ngClass]="uiElement.class"
    attr.preload="../src/preload.js"
  ></webview>
	`,
})
export class WebViewComponent extends BaseComponent {
}
