import { Component, Input } from "@angular/core";
import * as obj from 'object-path'

@Component({
  selector: 'json-editor'
  , templateUrl: './json-editor.component.html'
})
export class JsonEditorComponent {
  @Input() uiElement: any
  @Input() data: any

  // return value in json stringified format
  get value() {
    if (this.uiElement.path) {
      try {
        let value
        if (this.uiElement.path == '.') value = this.data
        else value = obj.get(this.data, this.uiElement.path)
        return JSON.stringify(value, null, 4)
      }
      catch (e) {
      }
    }
  }

  // try to set value parsed as json
  set value(v: any) {
    if (this.uiElement.path) {
      try {
        if (this.uiElement.path == '.') {
          let data = this.data
          Object.keys(data).forEach(function(key) { delete data[key]; });

          this.data = Object.assign(this.data, JSON.parse(v))
        }
        else obj.set(this.data, this.uiElement.path, JSON.parse(v))
      }
      catch (e) {
        console.error(e)
      }
    }
  }

}
