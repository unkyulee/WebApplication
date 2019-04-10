import { Component, Input } from "@angular/core";

// user Imports
import { ConfigService } from "src/app/services/config.service";
import { UserService } from "src/app/services/user/user.service";
import { Subscription } from "rxjs";
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";
import { Router } from "@angular/router";

@Component({
  selector: "script-box",
  template: ``
})
export class ScriptBoxComponent {
  @Input() uiElement: any;
  @Input() data: any;

  // event subscription
  onEvent: Subscription;
  constructor(
    public config: ConfigService,
    public user: UserService,
    public event: EventService,
    public rest: RestService,
    public router: Router
  ) {}

  ngOnInit() {
    // event handler
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );

    // run script
    if (this.uiElement.ngOnInit) {
      try {
        eval(this.uiElement.ngOnInit);
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
    if (this.uiElement.ngOnDestroy) {
      try {
        eval(this.uiElement.ngOnDestroy);
      } catch (e) {
        console.error(e);
      }
    }

    this.onEvent.unsubscribe();
  }
}
