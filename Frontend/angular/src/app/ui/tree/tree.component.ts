import { Component } from "@angular/core";
import { BaseComponent } from "../base.component";
import obj from "object-path";
import { TreeNode } from "primeng/api";

@Component({
  selector: "tree",
  templateUrl: `./tree.component.html`,
})
export class TreeComponent extends BaseComponent {
  ///
  _tree = [];
  get tree() {
    if (this.data && this.uiElement.key) {
      this._tree = obj.get(this.data, this.uiElement.key, []);
    }

    return this._tree;
  }

  set tree(v: any) {
    if (this.data && this.uiElement.key) {
      obj.set(this.data, this.uiElement.key, v);
    }

    // set default when value is empty
    if (!v && this.uiElement.key && this.uiElement.default) {
      let defaultValue = this.uiElement.default;
      try {
        defaultValue = eval(this.uiElement.default);
      } catch (e) {
        console.error(e);
      }
      obj.set(this.data, this.uiElement.key, defaultValue);
    }
  }
}
