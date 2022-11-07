// @ts-nocheck
import { Component, Injector } from "@angular/core";
import { EventService } from "./services/event.service";

// Global Injector
export let AppInjector: Injector;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(private injector: Injector, public event: EventService) {
    AppInjector = this.injector;
  }

  onEvent: Subscription;

  ngOnInit() {
    //
    this.onEvent = this.event.onEvent.subscribe(async (event) => {
      if (event.name == "loading-completed") {
        this.ready = true;
      } else if (event.name == "init") {
        this.ready = false;
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  ready = false;
}
