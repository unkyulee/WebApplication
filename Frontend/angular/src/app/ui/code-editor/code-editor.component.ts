import { Component, Input } from "@angular/core";
import obj from 'object-path';

// user Imports
import { BaseComponent } from "../base.component";
import { catchError } from "rxjs/operators";
import { EMPTY } from "rxjs";

@Component({
  selector: "code-editor",
  templateUrl: "code-editor.component.html"
})
export class CodeEditorComponent extends BaseComponent {
  error: string;
  type: string;
  compileError: string;

  ngOnInit() {
    super.ngOnInit();

    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.onEvent.unsubscribe();
  }

  eventHandler(event) {
    if (
      event &&
      event.name == "path" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      // update path
      this.uiElement.path = event.path;
    } else if (
      event &&
      event.name == "editorOptions" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      obj.ensureExists(this.uiElement, "editorOptions", {});
      this.uiElement.editorOptions = {
        ...this.uiElement.editorOptions,
        ...event.editorOptions
      };
    } else if (
      event &&
      event.name == "load-code" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      this.data = event.data;
    } else if (
      event &&
      event.name == "save" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      this.save();
    }
  }

  save() {
    // retrieve REST information
    let src = obj.get(this.uiElement, "save.src");
    try {
      src = eval(src);
    } catch (e) {}
    let method = obj.get(this.uiElement, "save.method", "post");
    try {
      method = eval(method);
    } catch {}

    // see if any transform to be done
    let data = { ...this.data };
    // remove _params_
    delete data._params_;
    if (obj.has(this.uiElement, "save.transform")) {
      try {
        eval(this.uiElement.save.transform);
      } catch (e) {
        console.error(e);
      }
    }

    // update data through rest web services
    if (src) {
      // hide the splash
      this.event.send({name: "splash-show"});

      this.rest
        .request(src, data, method)
        .pipe(
          catchError(err => {
            // hide the splash
            this.event.send({name: "splash-hide"});

            // save failed
            let errorAction = obj.get(this.uiElement, "save.errorAction");
            if (errorAction) {
              try {
                eval(errorAction);
              } catch (e) {
                console.error(e);
              }
            } else {
              console.error(err);
            }

            return EMPTY;
          })
        )
        .subscribe(response => this.saveAction(response));
    } else {
      // hide splash
      this.event.send({name: "splash-hide"});
    }
  }

  saveAction(response) {
    // hide the splash
    this.event.send({name: "splash-hide"});

    let saveAction = obj.get(this.uiElement, "save.saveAction");
    if (saveAction)
      try {
        eval(saveAction);
      } catch (e) {
        console.error(e);
      }
    else {
      // check if the response has error
      if (response && response.error) {
        this.snackBar.open(response.error, null, { duration: 2000 });
      } else {
        this.snackBar.open("Saved", null, { duration: 2000 });
      }
    }
  }

  _value;
  get value() {
    // fixed text
    this.error = "";
    this.type = "";

    // remove _params_
    let data = { ...this.data };
    delete data._params_;

    // when path is not specified then display the entire this.data
    data = obj.get(data, this.uiElement.path);
    if (typeof data == "undefined") {
      // property doesn't exist
      this.error = "JSON property does not exist.";
    } else if (data.constructor != "".constructor) {
      this.type = "object";
      this._value = JSON.stringify(data, null, 2);
    } else {
      this.type = "string";
      this._value = data;
    }

    return this._value;
  }

  set value(v: any) {
    this.compileError = "";

    if(v != this._value) {
      let data = v;
      if (this.type == "object") {
        // if the type is object then convert string -> object
        try {
          data = JSON.parse(data);
        } catch (e) {
          this.compileError = `${e.stack}`;
          return;
        }
      }
      if(this.uiElement.path) {
        obj.set(this.data, this.uiElement.path, data);
      } else {
        this.data = data;
      }
    }
  }
}
