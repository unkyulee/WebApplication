import { Component } from "@angular/core";
import obj from "object-path";

// user imports
import { BaseComponent } from "../../ui/base.component";

// get config from index.html
declare var window: any;

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends BaseComponent {
  loading = false;

  async ngOnInit() {
    obj.ensureExists(this, "data", {});
    obj.ensureExists(this, "uiElement", {});

    // load uielement
	this.load();
	
    // handle events
    this.onEvent = this.event.onEvent.subscribe(async (event) => {
      if (event.name == "login") {
        if (event.data) this.data = Object.assign(this.data, event.data);
        await this.authenticate();
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  load() {
    // retreive login screen
    this.rest
      .request(`${this.config.get("url")}/login.config`, null, "get", {}, true)
      .subscribe((r) => {
        this.uiElement = r;
        this.event.send({ name: "changed" });
      });
  }

  // login
  async authenticate() {
    // try login
    this.loading = true;
    // remove error message from the data
    delete this.data.error;

    try {
      // try login
      if (await this.auth.login(this.data)) {
        this.event.send({ name: "initialize" });
      }
    } catch (e) {
      // login error
      let message = obj.get(this.uiElement, `errors.${e.status}`, e.message);
      this.data.error = message;
    } finally {
      this.loading = false;
    }
  }
}
