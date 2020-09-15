import { Component } from "@angular/core";
import { BaseComponent } from "../../ui/base.component";

@Component({
  selector: "splash",
  templateUrl: "./splash.component.html",
  styleUrls: ["./splash.component.scss"]
})
export class SplashComponent extends BaseComponent {
  // show splash
  show: boolean = false;

  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event == "splash-show") {
        setTimeout(() => {
          this.show = true;
        }, 0);
      } else if (event == "splash-hide") {
        setTimeout(() => {
          this.show = false;
        }, 0);
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }
}
