import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";

// user Imports
import { UserService } from 'src/app/services/user/user.service';

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
  constructor(public user: UserService) {}

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
