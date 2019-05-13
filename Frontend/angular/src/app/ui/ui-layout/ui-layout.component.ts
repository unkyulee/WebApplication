import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";

// user Imports
import { UIService } from "src/app/services/ui.service";

@Component({
  selector: "ui-layout",
  template: `
    <ng-container *ngFor="let ui of uiElement.screen">
      <ng-container *ngIf="condition(ui)">
        <ng-container
          ui-layout-wrapper
          [uiElement]="ui"
          [data]="data"
        ></ng-container>
      </ng-container>
    </ng-container>
  `
})
export class UILayoutComponent {
  @Input() uiElement: any;
  @Input() data: any;

  // event subscription
  onEvent: Subscription;
  constructor(public uis: UIService) {}

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
