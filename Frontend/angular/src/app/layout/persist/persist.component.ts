import { Component } from "@angular/core";

// user services
import { BaseComponent } from "../../ui/base.component";

@Component({
  selector: "persist",
  templateUrl: "./persist.component.html",
})
export class PersistComponent extends BaseComponent {
  persistElements: [];

  ngOnInit() {
    // setup Ping
    this.setupPing();

    // register uiElement that needs to be loaded
  }

  ngOnDestroy() {
    this.websocket.close();
  }

  setupPing() {
    if (this.config.get("ping")) {
      let url = this.config.get("host");
      console.log(`ping ${url}`);
      this.websocket.connect(url).subscribe((x) => {
        console.log(x);
      });
    }
  }
}
