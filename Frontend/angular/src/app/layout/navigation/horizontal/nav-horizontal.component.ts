import { Component } from '@angular/core';
import obj from 'object-path';

// user imports
import { BaseComponent } from '../../../ui/base.component';
import { MenuItem } from 'primeng/api';

@Component({
	selector: 'nav-horizontal',
	templateUrl: './nav-horizontal.component.html',
	styleUrls: ['./nav-horizontal.component.scss'],
})
export class NavHorizontalComponent extends BaseComponent {
	// showLoadingBar
	showLoadingBar: boolean = false;

	// menu items
	items: MenuItem[] = [];

	// custom actions
	actions: MenuItem[] = [];

	ngOnInit() {
		// detect configuration changes
		this.onEvent = this.event.onEvent.subscribe((event) => {
			if (event.name == 'navigation-changed') {
				// reset actions
				this.updateActionMenu([]);
				// reset menu
				this.updateMenuModel();
			} else if (event.name == 'navigation-updated') {
				this.updateMenuModel();
			} else if (event.name == 'toolbar-actions') {
				this.updateActionMenu(event.data);
			} else if (event.name == 'splash-show') {
				this.showLoadingBar = true;
			} else if (event.name == 'splash-hide') {
				this.showLoadingBar = false;
			}
		});
	}

	updateMenuModel() {
		// form nav model
		let menu = [];
		for (let nav of this.config.get('nav', [])) {
			if (!this.permission.check(nav)) continue;
			if (!this.util.isElectron() && nav.type == 'desktop') continue;
			if (nav.type == 'hidden') continue;

			// single item
			if (!nav.children) {
				let menuItem = {
					label: nav.name,
					routerLink: [nav.url],
					icon: '',
					styleClass: ''
				};

				// active item
				if (this.nav.currNav.url == nav.url) {
					menuItem.styleClass = 'active';
				}

				menu.push(menuItem);
			}

			// child item
			if (nav.children) {
				let menuItem = {
					label: nav.name,
					icon: '',
					items: [],
					styleClass: ''
				};
				// populate child item
				for (let child of nav.children) {
					menuItem.items.push({
						label: child.name,
						routerLink: [child.url],
					});
					//
					if (this.nav.currNav.url == child.url) {
						menuItem.styleClass = 'active';
					}
				}

				menu.push(menuItem);
			}
		}

		//
		this.items = menu;
	}

	updateActionMenu(actions) {
		obj.ensureExists(actions, '', []);

		//
		let menuItems = [];

		// custom actions
		for (let action of actions) {
			let menuItem = {
				label: action.label,
				command: () => { this.safeEval(action.click) },
			};
			//
			menuItems.push(menuItem);
		}

		// theme actions
		if(this.config.get('theme.toolbar.actions', []).length > 0) {
			//
			menuItems.push({separator: true});
		}
		for (let action of this.config.get('theme.toolbar.actions', [])) {
			let menuItem = {
				label: action.label,
				command: () => { this.safeEval(action.click) },
			};
			//
			menuItems.push(menuItem);
		}

		// electron menu
		if(this.util.isElectron()) {
			menuItems.push({separator: true});
			menuItems.push({
				label: 'Force Reload Screen',
				command: () => { (<any>window).reload(); },
			});
			menuItems.push({
				label: 'Reset Service URL',
				command: () => { (<any>window).store.clear(); (<any>window).reload(); },
			});
		}

		// user actions - profile
		menuItems.push({separator: true});
		menuItems.push({
			label: this.user.name(),
			command: () => { this.nav.navigateByUrl(`/profile`); },
		});
		menuItems.push({
			label: 'Logout',
			command: () => { this.event.send('logout') },
		});

		this.actions = menuItems;
	}

	ngOnDestroy() {
		this.onEvent.unsubscribe();
	}
}
