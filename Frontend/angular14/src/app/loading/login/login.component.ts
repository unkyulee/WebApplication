// @ts-nocheck
import { Component } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { ConfigService } from "src/app/services/config.service";
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  constructor(
    private event: EventService,
    private auth: AuthService,
    private config: ConfigService,
    private rest: RestService
  ) {}

  onEvent: Subscription;

  // download uiElement
  loading = true;

  //
  data = {};
  uiElement: any = {};

  async ngOnInit() {
    // download uielement
    await this.download();

    // handle events
    this.onEvent = this.event.onEvent.subscribe(async (event) => {
      if (event.name == "login") {
        await this.authenticate();
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  async download() {
    this.loading = true;
    // retreive login screen
    this.uiElement = await this.rest.requestAsync(
      `${this.config.get("url")}/login.config`
    );
    this.loading = false;
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
        this.event.send({ name: "init" });
      }
    } catch (e) {
      // login error
      let message = obj.get(this.uiElement, `errors.${e.status}`, e.message);
      this.data.error = message;
    } finally {
      // close splash
      this.loading = false;
    }
  }
}
