// @ts-nocheck
import { Component, ChangeDetectorRef, NgZone } from "@angular/core";

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
    public ui: UIService,
    private zone: NgZone,
    private ref: ChangeDetectorRef
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
      } else if (event.name == "changed") {
        setTimeout(() => {
          this.zone.run(() => {
            this.ref.detectChanges();
          });
        });
      }
    });

    // set navigations
    this.navigations = this.get_navigations();

    // render page
    await this.render();
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
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

  // base data operations
  data_operations(event) {
    //
    if (event?.name == "merge-data") {
      this.data = Object.assign(this.data, event.data);
    } else if (event?.name == "insert-data") {
      obj.ensureExists(this.data, event.path, []);
      let data = obj.get(this.data, event.path);
      if (!data) data = [];

      if (data.indexOf(event.data) > -1) {
        // if exists then do nothing - it's already there
      } else if (
        event.datakey &&
        data.find((item) => item[event.datakey] == event.data[event.datakey])
      ) {
        let found = data.find(
          (item) => item[event.datakey] == event.data[event.datakey]
        );
        if (found) {
          // item found - replace it
          let index = data.indexOf(found);
          data[index] = event.data;
        }
      } else {
        // if not exists then add
        obj.push(this.data, event.path, event.data);
        obj.set(
          this.data,
          event.path,
          JSON.parse(JSON.stringify(obj.get(this.data, event.path)))
        );
      }
    } else if (
      event &&
      event.name == "delete-data" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      let data = obj.get(this.data, event.path);
      if (data) {
        if (data.indexOf(event.data) > -1) {
          // delete data
          data.splice(data.indexOf(event.data), 1);
        } else if (
          event.datakey &&
          data.find((item) => item[event.datakey] == event.data[event.datakey])
        ) {
          let found = data.find(
            (item) => item[event.datakey] == event.data[event.datakey]
          );
          if (found) {
            // item found - delete it
            data.splice(data.indexOf(found), 1);
          }
        }
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
