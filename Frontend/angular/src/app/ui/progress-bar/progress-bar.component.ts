import { Component, Input } from "@angular/core";

// user Imports
import { ConfigService } from "src/app/services/config.service";
import { UserService } from "src/app/services/user/user.service";
import { Subscription } from "rxjs";
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";
import { Router } from "@angular/router";

@Component({
  selector: "progress-bar",
  templateUrl: "./progress-bar.component.html"
})
export class ProgressBarComponent {
  @Input() uiElement: any;
  @Input() data: any;

  // event subscription
  onEvent: Subscription;

  // value
  value = 0
  bufferValue = 0

  constructor(
    public config: ConfigService,
    public user: UserService,
    public event: EventService,
    public rest: RestService,
    public router: Router
  ) {}

  ngOnInit() {
    // event handler
    this.onEvent = this.event.onEvent.subscribe(event => this.eventHandler(event));
  }

  eventHandler(event){
    if (
      event &&
      event.name == "progress" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
        // progress
        this.value = event.value
        this.bufferValue = event.bufferValue
    }
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  condition() {
    let result = true;
    if (this.uiElement.condition) {
      try {
        result = eval(this.uiElement.condition);
      } catch (e) {
        console.error(e);
      }
    }
    return result;
  }

}
