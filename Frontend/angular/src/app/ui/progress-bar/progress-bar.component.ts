import { Component, Input } from "@angular/core";

// user Imports
import { ConfigService } from "src/app/services/config.service";
import { UserService } from "src/app/services/user/user.service";
import { Subscription } from "rxjs";
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";
import { Router } from "@angular/router";
import { BaseComponent } from '../base.component';

@Component({
  selector: "progress-bar",
  templateUrl: "./progress-bar.component.html"
})
export class ProgressBarComponent extends BaseComponent {  
  // value
  value = 0
  bufferValue = 0

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
}
