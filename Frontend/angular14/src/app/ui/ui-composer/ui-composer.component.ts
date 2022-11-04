// @ts-nocheck
import { Component } from "@angular/core";
import obj from "object-path";

// user imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "ui-composer",
  templateUrl: "./ui-composer.component.html",
})
export class UIComposerComponent extends BaseComponent {
  context: any[] = [
    {
      key: "",
    },
  ];

  ngOnInit() {
    // detect configuration changes
    this.onEvent = this.event.onEvent.subscribe(
      async (event) => await this.eventHandler(event)
    );
  }

  async eventHandler(event) {
    if (event.name == "navigation-changed") {
      // hide all screen
      for (let context of this.context) {
        if (context.key) {
          // persist view
          context.style = {
            position: "absolute",
            top: "100vh",
          };
        } else {
          context.style = {
            display: "none",
          };
        }
      }

      // get current context
      // if the navigation doesn't have persist option then use default context
      let currentContext;
      if (obj.get(this.nav, "currNav.persist")) {
        currentContext = this.context.find(
          (x) => x.key == this.nav.currNav.url
        );
        if (!currentContext) {
          // create a new context
          currentContext = {
            key: this.nav.currNav.url,
            data: {},
          };
          this.context.push(currentContext);
          await this.loadUI(currentContext, this.nav.currNav.uiElementIds);
        }
      } else {
        currentContext = this.context.find((x) => x.key == "");
        currentContext.data = {
          _params_: {
            ...this.nav.getParams(),
            ...event.data,
          },
        };
        await this.loadUI(currentContext, this.nav.currNav.uiElementIds);
      }

      // reset style
      obj.set(currentContext, "style.display", "flex");
      obj.set(currentContext, "style.position", null);
      obj.set(currentContext, "style.top", null);
    }
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  async loadUI(context, uiElements) {
    // load ui
    context.uiElements = [];
    let elements = [];
    for (let id of uiElements) {
      let element = await this.ui.get(id);
      // run load script if exists
      if (element) {
        elements.push(element);
      }
    }
    context.uiElements = elements;
  }
}
