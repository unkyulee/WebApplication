import { Component } from "@angular/core";
var obj = require("object-path");

// user imports
import { BaseComponent } from "src/app/ui/base.component";

@Component({
  selector: "ui-composer",
  templateUrl: "./ui-composer.component.html"
})
export class UIComposerComponent extends BaseComponent {
  ngOnInit() {
    // detect configuration changes
    this.onEvent = this.event.onEvent.subscribe(async (event) =>
      await this.eventHandler(event)
    );
  }

  async eventHandler(event) {
    if (event.name == "navigation-changed") {
      // reset data
      this.data = {
        _params_: {
          ...this.nav.getParams(),
          ...event.data
        }
      };

      // load UI when navigation changes
      if (this.nav.currNav) {
        // check if there are any replication setup
        if (this.nav.currNav.init) {
          try {
            eval(this.nav.currNav.init);
          } catch (e) {
            console.error(e);
          }
        }
        await this.loadUI(this.nav.currNav.uiElementIds);
      }
    }
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  uiElements: any[];
  async loadUI(uiElements) {
    // load ui
    this.uiElements = [];
    let elements = [];
    for (let id of uiElements) {
      let element = await this.ui.get(id);
      // run load script if exists
      if (element) {
        elements.push(element);
      }
    }
    this.uiElements = elements;
  }
}
