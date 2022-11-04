import { Component } from "@angular/core";
import "file-saver";

// user imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "button-component",
  templateUrl: "./button.component.html",
})
export class ButtonComponent extends BaseComponent {
  eval(expression) {
    let v = expression;
    try {
      v = eval(expression);
    } catch (e) {}
    return v;
  }
}
