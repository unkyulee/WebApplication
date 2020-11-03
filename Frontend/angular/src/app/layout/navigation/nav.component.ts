import { Component } from "@angular/core";
import { MenuItem } from 'primeng/api';

// user imports
import { BaseComponent } from '../../ui/base.component';

@Component({
  selector: "nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent extends BaseComponent {

  // menu items
	items: MenuItem[] = [];

  ngOnInit() {
    super.ngOnInit();

    // detect configuration changes
    // detect configuration changes
		this.onEvent = this.event.onEvent.subscribe((event) => {
			if (event.name == 'navigation-updated') {
				this.updateMenuModel();
			}
		});
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  updateMenuModel() {
		// form nav model
		let menu = [];
		for (let nav of this.config.get('nav', [])) {
			if (!this.permission.check(nav)) continue;
			if (!this.util.isElectron() && nav.type == 'desktop') continue;
			if (nav.type == 'hidden' || nav.type == 'sub') continue;

			// single item
			if (!nav.children) {
				let menuItem = {
					label: nav.name,
					routerLink: [nav.url],
					icon: '',
					styleClass: '',
					badge: nav.badge
				};

				// active item
				if (this.nav.currNav.url == nav.url) {
					menuItem.styleClass = 'active';
				}

				// if badge
				if(menuItem.badge) {
					menuItem.icon = 'pi pi-circle-on'
				}

				menu.push(menuItem);
			}

			// child item
			if (nav.children) {
				let menuItem = {
					label: nav.name,
					icon: '',
					items: [],
					styleClass: '',
          badge: nav.badge,
          expanded: false
				};
				// if badge
				if(menuItem.badge) {
					menuItem.icon = 'pi pi-circle-on'
				}

				// populate child item
				for (let child of nav.children) {
					menuItem.items.push({
            label: child.name,
						routerLink: [child.url],
					});
					//
					if (this.nav.currNav.url == child.url) {
						menuItem.expanded = true;
					}
				}

				menu.push(menuItem);
			}
		}

		//
		this.items = menu;
  }

}
