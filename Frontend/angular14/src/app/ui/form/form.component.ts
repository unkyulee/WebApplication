// @ts-nocheck
import { Component } from "@angular/core";
import { EMPTY } from "rxjs";
import { catchError } from "rxjs/operators";
import obj from "object-path";

// user imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "form-component",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
})
export class FormComponent extends BaseComponent {
  async ngOnInit() {
    super.ngOnInit();

    // download data
    await this.requestDownload();
  }

  eventHandler(event) {
    if (
      event &&
      event.name == "save" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      this.save();
    } else if (
      event &&
      event.name == "delete" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      this.delete();
    } else if (event && event.name == "open-section") {
      let section = this.uiElement.screens.find((x) => x.key == event.key);
      if (section) section.expanded = true;
    } else if (event && event.name == "open-all-section") {
      for (let section of this.uiElement.screens) {
        section.expanded = true;
      }
    } else if (event && event.name == "close-section") {
      let section = this.uiElement.screens.find((x) => x.key == event.key);
      if (section) section.expanded = false;
    } else if (event && event.name == "close-all-section") {
      for (let section of this.uiElement.screens) {
        section.expanded = false;
      }
    }
  }

  requestDownload(cached?) {
    /*
    // retrieve REST information
    let src = this.uiElement.src;
    try {
      src = eval(src);
    } catch (e) {}

    if (src) {
      let method = this.uiElement.method;
      let data = this.uiElement.data;
      try {
        data = eval(data);
      } catch (e) {}

      // download data through rest web services
      this.rest
        .request(src, data, method, {}, cached)
        .pipe(
          catchError((err) => {
            //
            if (this.uiElement.errorAction) {
              try {
                eval(this.uiElement.errorAction);
              } catch (e) {
                console.error(e);
              }
            } else {
              console.error(err);
            }

            return EMPTY;
          })
        )
        .subscribe((response) => this.responseDownload(response));
    }
    */
  }

  responseDownload(response) {
    // go through data transformation
    let data = {};
    if (this.uiElement.transform) {
      try {
        // do not overwrite data
        data = eval(this.uiElement.transform);
      } catch (e) {
        console.error(e);
      }
    } else data = response;

    // do not overwrite existing data
    this.data = Object.assign(this.data, data);

    // detect changes on this.data
    this.dataDiffer = this.differs.find(this.data).create();
  }

  async save() {
    // check if there are not error
    let errorMessage = "";
    for (let screen of this.uiElement.screens) {
      for (let ui of screen.screens) {
        let value = this.data[ui.key]; // used by the evaluation script
        let error = eval(ui.errorCondition);
        if (error) {
          errorMessage += `${ui.errorMessage}\n`;
        }
      }
    }
    if (errorMessage) {
      console.error(errorMessage);
      return;
    }

    // beforeSave
    if (obj.get(this.uiElement, "beforeSave")) {
      try {
        await eval(obj.get(this.uiElement, "beforeSave"));
      } catch (e) {
        console.error(e);
      }
    }

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
        await eval(this.uiElement.save.transform);
      } catch (e) {
        console.error(e);
      }
    }

    // update data through rest web services
    if (src) {
      try {
        let response = await this.rest.requestAsync(src, data, method);
        this.saveAction(response);
      } catch (err) {
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
      }
    }

    setTimeout(() => {
      // reset changed flag
      this.changed = false;
    });
  }

  saveAction(response) {
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

  delete() {
    if (this.uiElement.delete) {
      // service setup
      let src = this.uiElement.delete.src;
      try {
        src = eval(src);
      } catch (e) {}
      let method = this.uiElement.delete.method;

      // download data through rest web services
      this.rest
        .request(src, null, method)
        .subscribe((response) => this.deleteAction());
    }
  }

  deleteAction() {
    // back to list
    if (this.uiElement.delete.deleteAction) {
      try {
        eval(this.uiElement.delete.deleteAction);
      } catch (e) {
        console.error(e);
      }
    } else {
      this.nav.back();
    }
  }
}
