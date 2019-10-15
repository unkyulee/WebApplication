import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import * as obj from "object-path";

// user Imports
import { BaseComponent } from "../base.component";
import { ConfigService } from "src/app/services/config.service";
import { UserService } from "src/app/services/user/user.service";
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";

@Component({
  selector: "code-editor",
  templateUrl: "code-editor.component.html",
  styleUrls: ["code-editor.component.css"]
})
export class CodeEditorComponent extends BaseComponent {
  constructor(
    public config: ConfigService,
    public user: UserService,
    public event: EventService,
    public rest: RestService,
    public router: Router
  ) {
    super();
  }

  @Input() uiElement: any;
  @Input() data: any;

  path: string;
  error: string;
  compileError: string;
  type: string;

  ngOnInit() {}
  ngOnDestroy() {}

  _language;
  get language() {
    return this._language;
  }
  set language(v) {
    this._language = v;

    // set language option for the editor
    if (!this.uiElement.editorOptions) this.uiElement.editorOptions = {};
    this.uiElement.editorOptions = {
      ...this.uiElement.editorOptions,
      language: v
    };
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
      this.error = "";
      this.type = "";

      // remove _params_
      delete this.data._params_;

      // when path is not specified then display the entire this.data
      let data = obj.get(this.data, this.path);
      if (!data) {
        // property doesn't exist
        this.error = "JSON property does not exist.";
      } else if (data.constructor != "".constructor) {
        this.type = "object";
        this._value = JSON.stringify(data, null, 2);
      } else {
        this.type = "string";
        this._value = data;
      }
    }

    // if null then assign default
    if (
      (typeof this._value == "undefined" || this._value == null) &&
      this.uiElement.default
    ) {
      this._value = this.uiElement.default;
      try {
        this._value = eval(this.uiElement.default);
      } catch (e) {}
    }

    // if format is specified
    if (this.uiElement.format) {
      try {
        this._value = eval(this.uiElement.format);
      } catch (e) {
        console.error(this.uiElement.format, e);
      }
    }

    return this._value;
  }

  set value(v: any) {
    this.compileError = "";

    if (this._value != v) {
      this._value = v;

      if (this.data && this.uiElement.key) {
        this.data[this.uiElement.key] = v;
      } else if (this.uiElement.editorType == "json") {
        let data = this._value;
        if (this.type == "object") {
          // if the type is object then convert string -> object
          try {
            data = JSON.parse(data);
          } catch(e) {            
            this.compileError = `${e.stack}`;
            throw e
          }          
        }
        obj.set(this.data, this.path, data)        
      }
    }
  }
}
