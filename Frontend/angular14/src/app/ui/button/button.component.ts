// @ts-nocheck
import { Component } from "@angular/core";
import { BaseComponent } from "../base.component";

@Component({
  selector: "button-component",
  templateUrl: "./button.component.html",
})
export class ButtonComponent extends BaseComponent {
  async click(event, item?, script?) {
    let clickScript = script ? script : this.uiElement.click;
    if (clickScript) {
      try {
        eval(clickScript);
      } catch (e) {
        this.event.send({ name: "error", error: `${e} ${e.stack}` });
        console.log(e);
      }
    }
  }
}
