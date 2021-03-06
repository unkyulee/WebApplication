import { Component } from "@angular/core";

// user Imports
import { BaseComponent } from "../base.component";

declare var window: any;

@Component({
  selector: "webview-component",
  template: `
    <webview
      *ngIf="isLoaded"
      [ngStyle]="uiElement.style"
      [ngClass]="uiElement.class"
      useragent="{{ uiElement.useragent }}"
      partition="{{
        uiElement.partition ? uiElement.partition : 'persist:default'
      }}"
      src="{{ uiElement.src ? uiElement.src : '_blank' }}"
      id="{{ uiElement.id }}"
      preload="../src/preload.js"
    ></webview>
  `,
})
export class WebViewComponent extends BaseComponent {
  isLoaded: boolean = false;
  ngOnInit() {
    super.ngOnInit();

    if (this.uiElement.preload) {
      // #preload_element_id
      this.uiElement.src = `${this.uiElement.src}#${this.uiElement.preload}`;
      // download the uiElement
      this.ui.get(this.uiElement.preload).then((r) => {
        try {
          // save preload script in electron store
          window.store.set(`http://${this.uiElement.preload}`, r.script);
        } catch(ex) {
          this.event.send({name: 'error', error: ex})
        }

        // load the webview when preload script is download
        this.isLoaded = true;
      });
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
