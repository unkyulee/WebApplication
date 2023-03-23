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

      // check if tab params exists
      let hash = this.nav.getHash();
      if (hash["tab"]) {
        //
        let key = hash["tab"];
        obj.ensureExists(this.uiElement, "screens", []);
        let uiElement = this.uiElement.screens.find((x) => x.key == key);
        this.uiElement.sidenav.uiElement = uiElement;
      }

      if (!this.uiElement.sidenav.uiElement) {
        // assign first tab as default
        this.uiElement.sidenav.uiElement = obj.get(this.uiElement, "screens.0");
      }
    }

    // change detection
    if (this.uiElement?.change?.check) {
      this.check_timer = setInterval(() => {
        this.changeDetection();
      }, 5000);
    }

    // event handler
    this.onEvent = this.event.onEvent.subscribe((event) =>
      this.eventHandler(event)
    );

    // download data
    await this.requestDownload();
  }

  override async ngOnDestroy(): void {
    if (this.check_timer) clearInterval(this.check_timer);
    // see if it is changed
    if (this.changed && this.uiElement?.change?.dirty) {
      await eval(this.uiElement.change.dirty);
    }

    this.onEvent.unsubscribe();
  }

  eventHandler(event) {
    if (event && (!event.key || event.key == this.uiElement.key)) {
      if (
        event.name == "save" &&
        (!event.key || event.key == this.uiElement.key)
      ) {
        this.save();
      }
      //
      else if (event?.name == "touch-array" && event.path) {
        let array = obj.get(this.data, event.path);
        if (array && Array.isArray(array)) {
          obj.set(this.data, event.path, [...array]);
        }
      } else if (event?.name == "delete-array" && event.path) {
        let array = obj.get(this.data, event.path);
        if (array && Array.isArray(array)) {
          if (array.indexOf(event.data) > -1) {
            // delete data
            array.splice(array.indexOf(event.data), 1);
            obj.set(this.data, event.path, [...array]);
          }
        }
      }
    }
  }

  async changeDetection() {
    // initial prev_data saves
    if (!this.prev_data) {
      this.prev_data = { ...this.data };
    }

    // check if this.uiElement.change.all is true
    // then check all diff
    for (let key of Object.keys(this.data)) {
      if (key == "_params_") continue;
      // compare key by key
      if (this.data[key] != this.prev_data[key]) {
        this.changed = true;
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
    if (this.uiElement.edit?.click) {
      eval(this.uiElement.edit.click);
    }
  }

  async save() {
    // run before save
    if (this.uiElement.save?.before) {
      if ((await eval(this.uiElement.save?.before)) == false) return;
    }

    // retrieve REST information
    let src = eval(this.uiElement.save?.src);
    if (!src) return;

    let method = this.uiElement.save?.method ?? "post";
    let response = await this.rest.requestAsync(src, this.data, method);

    // run after save
    if (this.uiElement.save?.after) await eval(this.uiElement.save?.after);

    // save the copy
    this.changed = false;
    this.prev_data = null;
  }

  async delete() {
    // run before save
    if (this.uiElement.delete?.before) {
      if ((await eval(this.uiElement.delete?.before)) == false) return;
    }

    // confirm
    this.event.send({
      name: "confirm",
      message: this.uiElement.delete?.message,
      accept: async () => {
        // retrieve REST information
        let src = eval(this.uiElement.delete?.src);
        if (!src) return;
        let method = this.uiElement.delete?.method ?? "delete";
        await this.rest.requestAsync(src, null, method);

        // run after save
        if (this.uiElement?.delete?.after) {
          await eval(this.uiElement?.delete?.after);
        }
      },
    });
  }

  close(event) {
    if (this.nav.prev_url) {
      history.back();
    } else if (this.nav.currNav?.parent_url) {
      this.nav.navigateByUrl(this.nav.currNav?.parent_url);
    }
  }

  async sectionChanged($event) {
    // fetch screen of the index
    let screen = obj.get(this.uiElement, `screens.${$event.selectedIndex}`, {});
    if (obj.get(screen, "sectionChanged")) {
      eval(obj.get(screen, "sectionChanged"));
    }
  }
}
