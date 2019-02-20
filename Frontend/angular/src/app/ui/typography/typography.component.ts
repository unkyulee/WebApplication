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

    // if null then assign default
    if (!v) {
      v = this.uiElement.default
      try { v = eval(this.uiElement.default) }
      catch (e) { console.error(e) }
    }

    // if format is specified
    if(this.uiElement.format) {
      try { v = eval(this.uiElement.format) }
      catch (e) { console.error(e) }
    }

    return v
  }


  condition() {
    let result = true;
    if (this.uiElement.condition) {
      try {
        result = eval(this.uiElement.condition);
      } catch (e) {
        console.error(e);
      }
    }
    return result;
  }

}
