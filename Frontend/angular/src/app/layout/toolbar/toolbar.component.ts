import { Component } from '@angular/core';

// user services
import { BaseComponent } from '../../ui/base.component';

@Component({
	selector: 'toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent extends BaseComponent {
	// toolbar title
	title: string;

	// isTopNavigation
	isTopNav: boolean = true;

	// show
	show: boolean = true;

	// showLoadingBar
	showLoadingBar: boolean = false;

	// custom actions
	actions = [];

	ngOnInit() {
		// handle events
		this.onEvent = this.event.onEvent.subscribe((event) => {
			if (event.name == 'navigation-changed') {
				this.show = true;
				this.handleNavigationChanged();
			} else if (event.name == 'toolbar-actions') {
				this.actions = event.data;
			} else if (event.name == 'splash-show') {
				this.showLoadingBar = true;
			} else if (event.name == 'splash-hide') {
				this.showLoadingBar = false;
			} else if (event.name == 'hide-toolbar') {
				this.show = false;
			}
		});
	}

	handleNavigationChanged() {
		// reset actions
		this.actions = [];
		//
		if (this.nav.currNav) {
			this.title = this.nav.currNav.name;

			// top or sub nav
			this.nav.currNav.type == 'sub' ? (this.isTopNav = false) : (this.isTopNav = true);
		}
	}

	ngOnDestroy() {
		this.onEvent.unsubscribe();
	}
}
