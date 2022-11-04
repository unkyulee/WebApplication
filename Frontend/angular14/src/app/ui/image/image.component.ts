// @ts-nocheck
import { Component } from "@angular/core";
import { Subject } from "rxjs";

// user Imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "image",
  template: `
    <img
      *ngIf="condition(uiElement)"
      [ngStyle]="uiElement.style"
      [ngClass]="uiElement.class"
      [src]="safeEval(uiElement.src)"
      (click)="click($event)"
      (error)="error($event)"
      [debounceTime]="100"
      (visible)="visible()"
    />
  `,
})
export class ImageComponent extends BaseComponent {
  // event handle when becomes visible
  private observer: IntersectionObserver | undefined;
  private subject$ = new Subject<{
    entry: IntersectionObserverEntry;
    observer: IntersectionObserver;
  }>();

  error(event) {
    if (this.uiElement && this.uiElement.error) {
      try {
        eval(this.uiElement.error);
      } catch (e) {
        console.error(e);
      }
    }
  }

  visible() {
    if (this.uiElement && this.uiElement.visible) {
      try {
        eval(this.uiElement.visible);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
