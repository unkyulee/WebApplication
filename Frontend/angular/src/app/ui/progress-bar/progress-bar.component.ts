import { Component } from "@angular/core";

// user Imports
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
