import { Component, Input } from "@angular/core";

@Component({
  selector: 'ui-layout-wrapper'
  , templateUrl: './ui-layout-wrapper.component.html'
})
export class UILayoutWrapperComponent {
  constructor(
  ) { }

  @Input() uiElement: any
  @Input() data: any
}
