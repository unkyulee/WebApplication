// @ts-nocheck
import { Component } from "@angular/core";

import { ConfigService } from "../services/config.service";
import { EventService } from "../services/event.service";

@Component({
  selector: "layout-engine",
  templateUrl: "./layout-engine.component.html",
  styleUrls: ["./layout-engine.component.css"],
})
export class LayoutEngineComponent {
  constructor(public config: ConfigService, public event: EventService) {}

  uiElement = {};
  data = {};

  layout = "";

  ngOnInit() {
    // check layout from config
    this.layout = this.config.get("layout", "side-nav");
  }
}
