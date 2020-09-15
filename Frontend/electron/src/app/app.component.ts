import { Component, Injector } from '@angular/core';

// Global Injector
export let AppInjector: Injector;

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(
    private injector: Injector
  ) {
    AppInjector = this.injector;
  }
}