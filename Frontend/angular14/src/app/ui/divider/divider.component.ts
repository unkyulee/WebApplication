import { Component } from "@angular/core";
import { BaseComponent } from '../base.component';

@Component({
  selector: "divider",
  template: `
    <mat-divider
      *ngIf="condition(uiElement)"
      [ngStyle]="uiElement.style"
      [ngClass]="uiElement.class"
    ></mat-divider>
  `
})
export class DividerComponent extends BaseComponent {  
}
