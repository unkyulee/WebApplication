import { Component, Injector } from "@angular/core";

// Global Injector
export let AppInjector: Injector;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
  ready = false;
}
