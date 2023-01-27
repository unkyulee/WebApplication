// @ts-nocheck
import { Component } from "@angular/core";
import { BaseComponent } from "../base.component";

@Component({
  selector: "layout",
  template: `
    <ng-container *ngFor="let ui of uiElement.screens">
      <ng-container
        ui-element
        *ngIf="condition(ui)"
        [uiElement]="ui"
        [data]="data"
        [style]="uiElement.layoutStyle"
        [class]="uiElement.layoutClass"
      >
      </ng-container>
    </ng-container>
  `,
})
export class LayoutComponent extends BaseComponent {}
