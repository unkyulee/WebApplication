import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

// user Imports
import { ConfigService } from "src/app/services/config.service";
import { UserService } from "src/app/services/user/user.service";
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";
import { DBService } from 'src/app/services/db/db.service';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: "script-box",
  template: ``
})
export class ScriptBoxComponent {
  @Input() uiElement: any;
  @Input() data: any;

  //
  local: any = {}

  // event subscription
  onEvent: Subscription;
  constructor(
    public config: ConfigService,
    public user: UserService,
    public event: EventService,
    public rest: RestService,
    public router: Router,
    public db: DBService,
    public nav: NavService
  ) {}

  ngOnInit() {
    // event handler
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );

    // run script
    if (this.uiElement.init) {
      try {
        eval(this.uiElement.init);
      } catch (e) {
        console.error(e);
      }
    }
  }

  eventHandler(event) {
    if (this.uiElement.eventHandler) {
      try {
        eval(this.uiElement.eventHandler);
      } catch (e) {
        console.error(e);
      }
    }
  }

  ngOnDestroy() {
    // run destroy
    if (this.uiElement.destroy) {
      try {
        eval(this.uiElement.destroy);
      } catch (e) {
        console.error(e);
      }
    }

    this.onEvent.unsubscribe();
  }
}
