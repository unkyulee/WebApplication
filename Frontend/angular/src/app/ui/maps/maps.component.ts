import { Component } from '@angular/core';

// user Imports
import { BaseComponent } from '../base.component';

@Component({
	selector: 'maps',
	template: `
    {{uiElement | json}}
	`,
})
export class MapsComponent extends BaseComponent {
}
