// @ts-nocheck
import { Component } from "@angular/core";
import { BaseComponent } from "../base.component";

@Component({
  selector: "drop-group",
  template: `
    <div
      cdkDropListGroup
      [style]="uiElement.layoutStyle"
      [class]="uiElement.layoutClass"
    >
      <ng-container *ngFor="let ui of uiElement.screens">
        <ng-container
          ui-element
          *ngIf="condition(ui)"
          [uiElement]="ui"
          [data]="data"
        >
        </ng-container>
      </ng-container>
    </div>
  `,
})
export class DropGroupComponent extends BaseComponent {}
