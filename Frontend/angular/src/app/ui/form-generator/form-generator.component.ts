import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, EMPTY } from "rxjs";
import { MatSnackBar } from "@angular/material";
import { catchError } from "rxjs/operators";
import * as obj from "object-path";

// user imports
import { UIService } from "../../services/ui.service";
import { RestService } from "../../services/rest.service";
import { NavService } from "../../services/nav.service";
import { ConfigService } from "../../services/config.service";
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user/user.service";

@Component({
  selector: "form-generator",
  templateUrl: "./form-generator.component.html"
})
export class FormGeneratorComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    private nav: NavService,
    private ui: UIService,
    private rest: RestService,
    private event: EventService,
    public snackBar: MatSnackBar,
    public config: ConfigService,
    public user: UserService
  ) {}

  @Input() uiElement: any;
  @Input() data: any;

  // data
  params: any;
  prevData: any;

  // event subscription
  onEvent: Subscription;
  ngOnInit() {
    // fetch params
    this.params = this.nav.getParams();

    // download data
    this.requestDownload();

    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event && event.name == "refresh") {
        // remove null fields
        for (let key of Object.keys(this.prevData))
          if (this.prevData[key] == null || this.prevData[key] == "")
            delete this.prevData[key];
        for (let key of Object.keys(this.data))
          if (this.data[key] == null || this.data[key] == "")
            delete this.data[key];

        // check if the data has not been changed
        if (JSON.stringify(this.prevData) == JSON.stringify(this.data)) {
          // refresh only if the record has not been changed
          setTimeout(() => {
            this.requestDownload();
          }, 100);
        }
      } else if (event && event.name == "merge-data") {
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
      } else if (event && event.name == "delete-data") {
        if (obj.has(this.data, event.path)) {
          let data = obj.get(this.data, event.path);
          if (data.indexOf(event.data) > -1) {
            // if exists then do nothing - it's already there
            data.splice(data.indexOf(event.data), 1);
          }
        }
      } else if (event && event.name == "save") {
        this.save(event.showSplash);
      }
    });
  }

  ngOnDestroy() {
    /*
    // remove null fields
    for (let key of Object.keys(this.prevData))
      if (this.prevData[key] == null || this.prevData[key] == "")
        delete this.prevData[key];
    for (let key of Object.keys(this.data))
      if (this.data[key] == null || this.data[key] == "") delete this.data[key];

    // check if the data has been changed
    if (JSON.stringify(this.prevData) != JSON.stringify(this.data)) {
      let willSave = confirm("Do you want to save before leaving this page?");
      if (willSave) this.save();
    }
    */

    this.onEvent.unsubscribe();
  }

  requestDownload() {
    // start the splash
    this.event.send("splash-show");

    // retrieve REST information
    let src = this.ui.find(["src"], this.uiElement);
    try {
      src = eval(src);
    } catch (e) {}
    let method = this.ui.find(["method"], this.uiElement);

    let data = this.ui.find(["data"], this.uiElement);
    try {
      data = eval(data);
    } catch (e) {}

    // download data through rest web services
    this.rest
      .request(src, data, method)
      .pipe(
        catchError(err => {
          // hide the splash
          this.event.send("splash-hide");
          //
          let errorAction = this.ui.find(["errorAction"], this.uiElement);
          if (errorAction) {
            try {
              eval(errorAction);
            } catch (e) {
              console.error(e);
            }
          } else alert(JSON.stringify(err));

          return EMPTY;
        })
      )
      .subscribe(response => this.responseDownload(response));
  }

  responseDownload(response) {
    // hide the splash
    this.event.send("splash-hide");

    // go through data transformation
    let transform = this.ui.find(["transform"], this.uiElement);
    if (transform) {
      try {
        this.data = eval(transform);
      } catch (e) {
        console.error(e);
      }
    } else this.data = response;

    // save copy of unchanged data
    this.prevData = JSON.parse(JSON.stringify(this.data));
  }

  save(showSplash?) {
    /*
    // check if there are not error
    let errorMessage = "";
    for (let screen of this.screenConfigs) {
      for (let ui of screen.screen) {
        let value = this.data[ui.key]; // used by the evaluation script
        let error = eval(ui.errorCondition);
        if (error) {
          errorMessage += `${ui.label} - ${ui.errorMessage}\n`;
        }
      }
    }
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    // check if there are any changelogs to be made
    let changelogKey = this.ui.find(["edit", "changelogKey"], this.uiElement);
    if (changelogKey) {
      let changelogs = this.ui.find(["edit", "changelogs"], this.uiElement);
      if (changelogs) {
        for (let changelog of changelogs) {
          // run condition
          let condition = false;
          try {
            condition = eval(changelog.condition);
          } catch (e) {}
          if (condition) {
            // make a log
            obj.ensureExists(this.data, changelogKey, []);
            let logs = obj.get(this.data, changelogKey);

            let message;
            try {
              message = eval(changelog.message);
            } catch (e) {}
            if (message) {
              logs.unshift({
                _created: new Date(),
                _createdBy: this.user.id(),
                _createdBy_name: this.user.name(),
                message: message
              });
            }
          }
        }
      }

    }

    // retrieve REST information
    let src = this.ui.find(["detail", "src"], this.uiElement);
    try {
      src = eval(src);
    } catch (e) {}
    let method = this.ui.find(["edit", "method"], this.uiElement, "post");

    // update data through rest web services
    this.rest
      .request(src, this.data, method)
      .pipe(
        catchError(err => {
          // hide the splash
          this.event.send("splash-hide");

          // save failed
          let errorAction = this.ui.find(
            ["edit", "errorAction"],
            this.uiElement
          );
          if (errorAction) {
            try {
              eval(errorAction);
            } catch (e) {
              console.error(e);
            }
          } else alert(JSON.stringify(err));

          return EMPTY;
        })
      )
      .subscribe(response => {
        // hide the splash
        this.event.send("splash-hide");

        // send notification
        if (JSON.stringify(this.prevData) != JSON.stringify(this.data)) {
          this.sendNotification();
        }

        // reset dirty state
        this.prevData = Object.assign({}, this.data);

        let saveAction = this.ui.find(["edit", "saveAction"], this.uiElement);
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
      });
      */
  }
}
