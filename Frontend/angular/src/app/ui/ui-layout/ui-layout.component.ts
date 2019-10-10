import { Component, HostListener } from "@angular/core";
import { Router } from '@angular/router';
import { Subscription } from "rxjs";

// user Imports
import { BaseComponent } from "../base.component";
import { UserService } from "src/app/services/user/user.service";
import { CordovaService } from 'src/app/services/cordova.service';
import { RestService } from 'src/app/services/rest.service';
import { EventService } from 'src/app/services/event.service';
import { ConfigService } from 'src/app/services/config.service';

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
  constructor(
    public config: ConfigService,
    public user: UserService,
    public event: EventService,
    public rest: RestService,
    public router: Router,
    public cordova: CordovaService
  ) {
    super();
  }

  @HostListener("click") onClick() {
    if (this.uiElement.click) {
      this.click(this.data, this.uiElement.click);
    }
  }
}
