import { Component } from "@angular/core";
import obj from 'object-path';

// user imports
import { BaseComponent } from '../../../ui/base.component';

@Component({
  selector: "nav-vertical",
  templateUrl: "./nav-vertical.component.html",
  styleUrls: ["./nav-vertical.component.scss"]
})
export class NavVerticalComponent extends BaseComponent {
  currUrl: string;
  ngOnInit() {
    // detect configuration changes
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event.name == "navigation-changed") {
        this.currUrl = obj.get(event, "data.url");
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }
}
