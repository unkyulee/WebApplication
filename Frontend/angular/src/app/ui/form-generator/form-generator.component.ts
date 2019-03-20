import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from "@angular/core";
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

  _data: any = {}
  get data() {
    if (JSON.stringify(this._data) == '{}') {
      if(this.uiElement.default) {
        this._data = this.uiElement.default;
        try {
          this._data = eval(this.uiElement.default);
        } catch (e) {
          console.error(e);
        }
      }
    }

    // if format is specified
    if (this._data && this.uiElement.format) {
      try {
        this._data = eval(this.uiElement.format);
      } catch (e) {
        console.error(e);
      }
    }

    return this._data;
  }

  @Input('data')
  set data(v) {
    this._data = v;
  }

  // data
  params: any;
  prevData: any;

  // event subscription
  onEvent: Subscription;
  ngOnInit() {
    // download data
    this.requestDownload();

    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event && event.name == "refresh") {
        this.requestDownload();
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
        this.save();
      } else if (event && event.name == "delete") {
        this.delete();
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  requestDownload() {
    // fetch params
    this.params = this.nav.getParams();

    // retrieve REST information
    let src = this.ui.find(["src"], this.uiElement);
    try {
      src = eval(src);
    } catch (e) {}

    if (src) {
      let method = this.ui.find(["method"], this.uiElement);
      let data = this.ui.find(["data"], this.uiElement);
      try {
        data = eval(data);
      } catch (e) {}

      // download data through rest web services
      // start the splash
      this.event.send("splash-show");
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
  }

  responseDownload(response) {
    // hide the splash
    this.event.send("splash-hide");

    // go through data transformation
    let data = {};
    let transform = this.ui.find(["transform"], this.uiElement);
    if (transform) {
      try {
        // do not overwrite data
        data = eval(transform);
      } catch (e) {
        console.error(e);
      }
    } else data = response;

    // do not overwrite existing data
    Object.assign(this.data, data)

    // save copy of unchanged data
    this.prevData = JSON.parse(JSON.stringify(this.data));
  }

  save() {
    // hide the splash
    this.event.send("splash-show");

    // check if there are not error
    let errorMessage = "";
    for (let screen of this.uiElement.screen) {
      for (let ui of screen.screen) {
        let value = this.data[ui.key]; // used by the evaluation script
        let error = eval(ui.errorCondition);
        if (error) {
          errorMessage += `${ui.errorMessage}\n`;
        }
      }
    }
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    // retrieve REST information
    let src = this.ui.find(["save", "src"], this.uiElement);
    try {
      src = eval(src);
    } catch (e) {}
    let method = this.ui.find(["save", "method"], this.uiElement, "post");
    try {
      method = eval(method)
    } catch {}

    // see if any transform to be done
    let data = this.data;
    let transform = this.ui.find(["save", "transform"], this.uiElement);
    if(transform) {
      try {
        eval(transform)
      } catch(e) { console.error(e) }
    }

    // update data through rest web services
    let that = this;
    this.rest
      .request(src, data, method)
      .pipe(
        catchError(err => {
          // hide the splash
          this.event.send("splash-hide");

          // save failed
          let errorAction = this.ui.find(
            ["save", "errorAction"],
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

        // reset dirty state
        this.prevData = Object.assign({}, this.data);

        let saveAction = this.ui.find(["save", "saveAction"], this.uiElement);
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
      this.rest.request(src, null, method).subscribe(response => {
        // back to list
        this.nav.back();
      });
    }
  }

  condition(script) {
    let result = true;
    if (script) {
      try {
        result = eval(script);
      } catch (e) {
        console.error(e);
      }
    }
    return result;
  }
}
