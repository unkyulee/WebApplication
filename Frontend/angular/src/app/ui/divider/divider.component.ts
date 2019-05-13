import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";

// user Imports
import { UIService } from "src/app/services/ui.service";

@Component({
  selector: "divider",
  template: `
    <mat-divider
      *ngIf="condition(uiElement)"
      [ngStyle]="uiElement.style"
      [ngClass]="uiElement.class"
    ></mat-divider>
  `
})
export class DividerComponent {
  @Input() uiElement: any;
  @Input() data: any;

  constructor() {}

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
