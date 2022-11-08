// @ts-nocheck
import { Component } from "@angular/core";

import { ConfigService } from "../services/config.service";
import { EventService } from "../services/event.service";
import { NavService } from "../services/nav.service";
import { RestService } from "../services/rest.service";
import { UIService } from "../services/ui.service";
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
    public util: UtilService,
    public ui: UIService
  ) {}

  uiElement = {};
  data = {};
  navigations: [];
  actions: [];

  async ngOnInit() {
    // check layout from config
    this.layout = this.config.get("layout", "side-nav");

    // detect configuration changes
    this.onEvent = this.event.onEvent.subscribe(async (event) => {
      if (
        event.name == "navigation-updated" ||
        event.name == "navigation-changed"
      ) {
        // set initial navigation
        this.navigations = this.get_navigations();

        // render page
        await this.render();
      }
    });

    // set navigations
    this.navigations = this.get_navigations();

    // render page
    await this.render();
  }

  // render page
  async render() {
    //
    let currNav = obj.get(this.nav, "currNav");
    if (currNav) {
      // load uiElement
      if (obj.get(currNav, "uiElementIds", []).length > 0) {
        this.uiElement = await this.ui.get(obj.get(currNav, "uiElementIds.0"));
      }
    }
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
            menuItem.styleClass = "active";
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
