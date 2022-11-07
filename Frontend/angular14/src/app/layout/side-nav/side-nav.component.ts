// @ts-nocheck
import { Component, Input } from "@angular/core";
import { ConfigService } from "src/app/services/config.service";
import { EventService } from "src/app/services/event.service";
import { NavService } from "src/app/services/nav.service";
import { RestService } from "src/app/services/rest.service";
import { UtilService } from "src/app/services/util.service";

@Component({
  selector: "side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.css"],
})
export class SideNavComponent {
  @Input() uiElement: any;
  @Input() data: any;

  constructor(
    public config: ConfigService,
    public event: EventService,
    public nav: NavService,
    public rest: RestService,
    public util: UtilService
  ) {}

  // toolbar actions
  actions: [];

  navigations: [];

  ngOnInit() {
    // set navigations
    this.navigations = this.get_navigations();
  }

  // navigations
  get_navigations() {
    // form nav model
    let menu = [];

    for (let n of this.config.get("nav", [])) {
      if (!this.condition(n)) continue;
      if (!this.nav.check_permission(n)) continue;
      if (!this.util.isElectron() && n.type == "desktop") continue;
      if (n.type == "hidden" || n.type == "sub") continue;

      // single item
      if (!n.children) {
        let menuItem = {
          label: n.name,
          routerLink: [n.url],
          icon: "",
          styleClass: "",
          badge: n.badge,
        };

        // active item

        if (this.nav.currNav?.url == n.url) {
          menuItem.styleClass = "active";
        }

        // if badge
        if (menuItem.badge) {
          menuItem.icon = "pi pi-circle-on";
        }

        menu.push(menuItem);
      }

      // child item
      if (n.children) {
        let menuItem = {
          label: n.name,
          icon: "",
          items: [],
          styleClass: "",
          badge: n.badge,
          expanded: false,
        };
        // if badge
        if (menuItem.badge) {
          menuItem.icon = "pi pi-circle-on";
        }

        // populate child item
        for (let child of n.children) {
          if (!this.condition(child)) continue;
          if (!this.nav.check_permission(child)) continue;

          if (child.type == "item") {
            menuItem.items.push({
              label: child.name,
              routerLink: [child.url],
            });
          }

          //
          if (this.nav.currNav?.url == child.url) {
            menuItem.expanded = true;
          }
        }

        menu.push(menuItem);
      }
    }

    //
    return menu;
  }

  condition(uiElement) {
    let result = true;
    if (uiElement && uiElement.condition) {
      try {
        result = eval(uiElement.condition);
      } catch (e) {
        console.error(uiElement.condition, e);
        result = false;
      }
    }
    return result;
  }
}

/*
// @ts-nocheck
import { Component } from "@angular/core";

@Component({
  selector: "appbar",
  templateUrl: "./appbar.component.html",
  styleUrls: ["./appbar.component.scss"],
})
export class AppBarComponent {
  // toolbar title
  title: string;

  // isTopNavigation
  isTopNav: boolean = true;
  isOffline: boolean;

  // show
  show: boolean = true;

  // showLoadingBar
  showLoadingBar: boolean = false;

  // custom actions
  actions = [];

  ngOnInit() {
    // handle events
    this.onEvent = this.event.onEvent.subscribe((event) => {
      if (event.name == "navigation-changed") {
        this.show = true;
        this.handleNavigationChanged();
      } else if (event.name == "toolbar-actions") {
        this.actions = event.data;
      } else if (event.name == "splash-show") {
        this.showLoadingBar = true;
      } else if (event.name == "splash-hide") {
        this.showLoadingBar = false;
      } else if (event.name == "hide-toolbar") {
        this.show = false;
      } else if (event.name == "online") {
        this.isOffline = false;
      } else if (event.name == "offline") {
        this.isOffline = true;
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
      this.nav.currNav.type == "sub"
        ? (this.isTopNav = false)
        : (this.isTopNav = true);
    }
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }
}

*/

/*

import { Component } from "@angular/core";
import { MenuItem } from "primeng/api";

// user imports
import { BaseComponent } from "../../../ui/base.component";

@Component({
  selector: "nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent extends BaseComponent {
  // menu items
  items: MenuItem[] = [];

  ngOnInit() {
    super.ngOnInit();

    // detect configuration changes
    this.onEvent = this.event.onEvent.subscribe((event) => {
      if (
        event.name == "navigation-updated" ||
        event.name == "navigation-chnaged"
      ) {
        this.updateMenuModel();
        this.event.send({ name: "changed" });
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  updateMenuModel() {
    // form nav model
    let menu = [];

    for (let nav of this.config.get("nav", [])) {
      if (!this.condition(nav)) continue;
      if (!this.permission.check(nav)) continue;
      if (!this.util.isElectron() && nav.type == "desktop") continue;
      if (nav.type == "hidden" || nav.type == "sub") continue;

      // single item
      if (!nav.children) {
        let menuItem = {
          label: nav.name,
          routerLink: [nav.url],
          icon: "",
          styleClass: "",
          badge: nav.badge,
        };

        // active item
        if (this.nav.currNav.url == nav.url) {
          menuItem.styleClass = "active";
        }

        // if badge
        if (menuItem.badge) {
          menuItem.icon = "pi pi-circle-on";
        }

        menu.push(menuItem);
      }

      // child item
      if (nav.children) {
        let menuItem = {
          label: nav.name,
          icon: "",
          items: [],
          styleClass: "",
          badge: nav.badge,
          expanded: false,
        };
        // if badge
        if (menuItem.badge) {
          menuItem.icon = "pi pi-circle-on";
        }

        // populate child item
        for (let child of nav.children) {
          if (!this.condition(child)) continue;
          if (!this.permission.check(child)) continue;

          if (child.type == "item") {
            menuItem.items.push({
              label: child.name,
              routerLink: [child.url],
            });
          }

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

*/
