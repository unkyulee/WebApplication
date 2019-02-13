import { Component, Input } from "@angular/core";

@Component({
  selector: 'typography'
  , templateUrl: './typography.component.html'
})
export class TypographyComponent {
  constructor(
  ) { }

  @Input() uiElement: any
  @Input() data: any

  get value() {
    let v = null;

    // data driven
    if (this.data && this.uiElement.key) {
      // set value
      v = this.data[this.uiElement.key]
    }

    // fixed text
    else if (this.uiElement.text) {
      // set value
      v = this.uiElement.text
    }

    return v
  }
}
