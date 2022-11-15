// @ts-nocheck
import { Component } from "@angular/core";

// user imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "form-component",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
})
export class FormComponent extends BaseComponent {
  // change detection parameters
  changed = false;
  prev_data = null;
  check_timer;

  constructor() {
    super();
  }

  async ngOnInit() {
    super.ngOnInit();

    // if formType is sidenav - choose the first menu
    if (this.uiElement.formType == "sidenav") {
      obj.ensureExists(this.uiElement, "sidenav", {});
      this.uiElement.sidenav.uiElement = obj.get(this.uiElement, "screens.0");
    }

    // change detection
    if (this.uiElement?.change?.check) {
      this.check_timer = setInterval(() => {
        this.changeDetection();
      }, 3000);
    }

    // download data
    await this.requestDownload();
  }

  override ngOnDestroy(): void {
    if (this.check_timer) clearInterval(this.check_timer);
  }

  async changeDetection() {
    // initial prev_data saves
    if (!this.prev_data) {
      this.prev_data = { ...this.data };
    }

    // check if this.uiElement.change.all is true
    // then check all diff
    for (let key of Object.keys(this.data)) {
      // compare key by key
      if (this.data[key] != this.prev_data[key]) {
        this.changed = true;
        console.log(`change detected - ${key} - ${this.data[key]}`);
      }
    }
  }

  async requestDownload() {
    // retrieve REST information
    let src = this.uiElement.data?.src;
    let method = this.uiElement.data?.method ?? "get";
    let data = this.uiElement.data?.data ?? {};

    try {
      src = eval(src);
    } catch (e) {}

    // if src doesn't exists then stop
    if (!src) return;

    // download data through rest web services
    let response = await this.rest.requestAsync(src, data, method);

    // go through data transformation
    if (this.uiElement.data?.transform) {
      try {
        // do not overwrite data
        response = eval(this.uiElement.data?.transform);
      } catch (e) {
        console.error(e);
      }
    }

    // do not overwrite existing data
    Object.assign(this.data, response);

    // save the copy
    this.changed = false;
    this.prev_data = null;
  }

  async edit(event) {
    obj.ensureExists(this.uiElement, "sidenav", {});
    this.uiElement.sidenav.uiElement = obj.get(this.uiElement, "screens.0");
    this.uiElement.formType = "sidenav";
  }

  async save() {
    // run before save
    if (this.uiElement.save?.before) {
      try {
        await eval(this.uiElement.save?.before);
      } catch (e) {
        console.error(e);
      }
    }

    // retrieve REST information
    let src = this.uiElement.save?.src;
    let method = this.uiElement.save?.method ?? "post";
    try {
      src = eval(src);
    } catch (e) {}

    if (!src) return;

    let response = await this.rest.requestAsync(src, this.data, method);

    // run after save
    if (this.uiElement.save?.after) {
      try {
        await eval(this.uiElement.save?.after);
      } catch (e) {
        console.error(e);
      }
    }

    // save the copy
    this.changed = false;
    this.prev_data = null;
  }

  async delete() {
    // run before save
    if (this.uiElement.delete?.before) {
      try {
        await eval(this.uiElement.delete?.before);
      } catch (e) {
        console.error(e);
      }
    }

    // retrieve REST information
    let src = this.uiElement.delete?.src;
    let method = this.uiElement.delete?.method ?? "delete";
    try {
      src = eval(src);
    } catch (e) {}

    if (!src) return;

    let response = await this.rest.requestAsync(src, this.data, method);

    // run after save
    if (this.uiElement?.delete?.after) {
      try {
        await eval(this.uiElement?.delete?.after);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async sectionChanged($event) {
    console.log("section changed", $event);
  }
}
