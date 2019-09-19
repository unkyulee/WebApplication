import { Component, Input } from "@angular/core";
import { ConfigService } from "src/app/services/config.service";
import { EventService } from "src/app/services/event.service";
import { Subscription } from "rxjs";

@Component({
  selector: "filter-group",
  templateUrl: "./filter-group.component.html"
})
export class FilterGroupComponent {
  constructor(
    public config: ConfigService,
    public event: EventService
  ) {}

  @Input() uiElement: any;
  @Input() data: any;

  // event subscription
  onEvent: Subscription;
  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event && event.name == "show-filter") {
        this.uiElement.showFilter = true;
      }
    });
  }

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
