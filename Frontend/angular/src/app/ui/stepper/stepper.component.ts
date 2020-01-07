import { Component } from "@angular/core";
import { BaseComponent } from '../base.component';
var obj = require("object-path");

@Component({
  selector: "stepper",
  templateUrl: "stepper.component.html"
})
export class StepperComponent extends BaseComponent {
  ngOnInit() {
    super.ngOnInit();

    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );
  }

  eventHandler(event) {
    if (event && event.name == "merge-data") {
      this.data = Object.assign(this.data, event.data);
    } else if (event && event.name == "insert-data") {
      obj.ensureExists(this.data, event.path, []);
      let data = obj.get(this.data, event.path);
      if (!data) data = [];

      if (data.indexOf(event.data) > -1) {
        // if exists then do nothing - it's already there
      } else if (
        event.datakey &&
        data.find(item => item[event.datakey] == event.data[event.datakey])
      ) {
        let found = data.find(
          item => item[event.datakey] == event.data[event.datakey]
        );
        if (found) {
          // item found - replace it
          let index = data.indexOf(found);
          data[index] = event.data;
        }
      } else {
        // if not exists then add
        obj.push(this.data, event.path, event.data);
        obj.set(
          this.data,
          event.path,
          JSON.parse(JSON.stringify(obj.get(this.data, event.path)))
        );
      }
    } else if (
      event &&
      event.name == "delete-data" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      if (obj.has(this.data, event.path)) {
        let data = obj.get(this.data, event.path);
        if (data.indexOf(event.data) > -1) {
          // if exists then do nothing - it's already there
          data.splice(data.indexOf(event.data), 1);
        }
      }
    }
  }

  selectionChanged(event) {
    if(obj.has(this.uiElement, 'selectionChanged')) {
      try {
        eval(this.uiElement.selectionChanged)
      } catch(e) {
        console.error(e)
      }
    }

  }
}
