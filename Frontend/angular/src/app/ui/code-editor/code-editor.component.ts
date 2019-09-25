import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import * as obj from "object-path";

// user Imports
import { BaseComponent } from '../base.component';
import { ConfigService } from "src/app/services/config.service";
import { UserService } from "src/app/services/user/user.service";
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";

@Component({
  selector: "code-editor",
  templateUrl: "code-editor.component.html"
})
export class CodeEditorComponent extends BaseComponent {
  constructor(
    public config: ConfigService,
    public user: UserService,
    public event: EventService,
    public rest: RestService,
    public router: Router
  ) {
    super()
  }

  @Input() uiElement: any;
  @Input() data: any;

  path: string = '';
  error: string = '';

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  _value;
  get value() {
    // fixed text
    if (this.uiElement.text) {
      // set value
      this._value = this.uiElement.text;
    }

    // key exists
    else if (this.data && this.uiElement.key) {
      // set value
      this._value = this.data[this.uiElement.key];
    }

    // if editor type is json then get value based on the path
    else if (this.uiElement.editorType == "json") {
      this.error = '';
      if (!this.path) {
        this._value = JSON.stringify(this.data, null, 2)
      }
      else if (this.path && obj.has(this.data, this.path)) {
        this._value = JSON.stringify(obj.get(this.data, this.path), null, 2)
      } else {
        // property doesn't exist
        this.error = 'JSON property does not exist.'
      }
    }

    // if null then assign default
    if ((typeof this._value == "undefined" || this._value == null) && this.uiElement.default) {
      this._value = this.uiElement.default;
      try {
        this._value = eval(this.uiElement.default);
      } catch (e) { }
    }

    // if format is specified
    if (this.uiElement.format) {
      try {
        this._value = eval(this.uiElement.format);
      } catch (e) {
        console.error(this.uiElement.format, e)
      }
    }

    return this._value;
  }

  set value(v: any) {
    if (this._value != v) {
      this._value = v;

      if (this.data && this.uiElement.key) {
        this.data[this.uiElement.key] = v;
      } else if (this.uiElement.editorType == "json") {
        this.error = '';
        if (!this.path) {
          try {
            this.data = JSON.parse(this._value)
          } catch(e) {
            this.error = `${e.stack}`
          }          
        }
        else if (this.path && obj.has(this.data, this.path)) {
          try {
            obj.set(this.data, this.path, JSON.parse(this._value) )
          } catch(e) {
            this.error = `${e.stack}`
          }          
        } else {
          // property doesn't exist
          this.error = 'JSON property does not exist.'
        }
      }
    }
  }
}
