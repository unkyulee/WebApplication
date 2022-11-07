// @ts-nocheck
import { Component } from "@angular/core";

import { ConfigService } from "../services/config.service";
import { EventService } from "../services/event.service";
import { NavService } from "../services/nav.service";
import { RestService } from "../services/rest.service";
import { UtilService } from "../services/util.service";

@Component({
  selector: "layout-engine",
  templateUrl: "./layout-engine.component.html",
  styleUrls: ["./layout-engine.component.css"],
})
export class LayoutEngineComponent {
  constructor(
    public config: ConfigService,
    public event: EventService,
    public nav: NavService,
    public rest: RestService,
    public util: UtilService
  ) {}

  uiElement = {};
  data = {};
  navigations: [];
  actions: [];

  ngOnInit() {
    // check layout from config
    this.layout = this.config.get("layout", "side-nav");

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
