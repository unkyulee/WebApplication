import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";

// user Imports
import { UserService } from 'src/app/services/user/user.service';
import { BaseComponent } from '../base.component';

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
export class UILayoutComponent extends BaseComponent { 

  // event subscription  
  constructor(public user: UserService) { super() }

}
