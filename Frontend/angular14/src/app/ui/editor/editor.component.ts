// @ts-nocheck
import { Component, ViewChild } from "@angular/core";
import { BaseComponent } from "../base.component";
import { Subject } from "rxjs";
import { distinctUntilChanged, debounceTime } from "rxjs/operators";
import { Editor } from "primeng/editor";

@Component({
  selector: "editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.css"],
})
export class EditorComponent extends BaseComponent {
  @ViewChild("editor") editor: Editor;

  typeAheadEventEmitter = new Subject<string>();

  ngOnInit() {
    super.ngOnInit();

    // not all the input will be sent as an event / rest
    // will be debounced every 700 ms
    this.typeAheadEventEmitter
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe((v) => this.inputChanged(v));
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    // eliminate the bug that adds new line after a list
    //this.editor.getQuill().options.modules.clipboard.matchVisual = false;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.typeAheadEventEmitter.unsubscribe();
  }

  _value: any;
  get value() {
    if (this.data && this.uiElement.key) {
      // if null then assign default
      if (typeof obj.get(this.data, this.uiElement.key) == "undefined") {
        let def = this.uiElement.default;
        try {
          def = eval(this.uiElement.default);
        } catch (e) {}
        obj.set(this.data, this.uiElement.key, def);
      }

      // set value
      this._value = obj.get(this.data, this.uiElement.key);
    }

    // Transform
    if (this.uiElement.transform) {
      try {
        this._value = eval(this.uiElement.transform);
      } catch (e) {}
    }

    return this._value;
  }

  set value(v: any) {
    this._value = v;

    if (this.data && this.uiElement.key) {
      obj.set(this.data, this.uiElement.key, v);
      // if number
      if (v && this.uiElement.inputType == "number")
        obj.set(this.data, this.uiElement.key, parseFloat(v));
    }

    this.typeAheadEventEmitter.next(v);
  }

  inputChanged(v) {
    // see if there are any input change handlers
    if (this.uiElement.changed) {
      try {
        eval(this.uiElement.changed);
      } catch (ex) {
        console.error(ex);
      }
    }
  }
}
