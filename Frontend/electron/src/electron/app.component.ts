import { Component, Injector } from '@angular/core';

// Global Injector
export let AppInjector: Injector;

@Component({
  selector: 'app-root',
  template: 'hi'
})
export class AppComponent {
  constructor(
    private injector: Injector
  ) {
    AppInjector = this.injector;
  }
}