import { Component, HostListener, ViewChild } from "@angular/core";
import * as obj from "object-path";

// user Imports
import { BaseComponent } from "../base.component";
import { MatSidenav } from "@angular/material/sidenav";

@Component({
  selector: "side-nav",
  templateUrl: "side-nav.component.html"
})
export class SideNavComponent extends BaseComponent {
  @HostListener("click") onClick() {
    if (obj.has(this.uiElement, "click")) {
      this.click(this.data, this.uiElement.click);
    }
  }

  // drawer
  @ViewChild("sidenav", {static: false}) sidenav: MatSidenav;

  ngOnInit() {
    // event handler
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.onEvent.unsubscribe();
  }

  eventHandler(event) {
    if (
      event &&
      event.name == "toggle-sidenav" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      this.sidenav.toggle();
    } else if (
      event &&
      event.name == "open-sidenav" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      this.sidenav.open()
    } else if (
      event &&
      event.name == "close-sidenav" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      this.sidenav.close()
    }
  }
}
