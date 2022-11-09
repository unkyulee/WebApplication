// @ts-nocheck
import { Component } from "@angular/core";
import { Observable, of, timer } from "rxjs";
import {
  delayWhen,
  filter,
  map,
  retryWhen,
  switchMap,
  tap,
} from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

import { ConfigService } from "../../../services/config.service";
import { EventService } from "../../../services/event.service";
import { NavService } from "../../../services/nav.service";
import { RestService } from "../../../services/rest.service";
import { UIService } from "../../../services/ui.service";
import { UtilService } from "../../../services/util.service";

@Component({
  selector: "ping",
  templateUrl: "./ping.component.html",
  styleUrls: ["./ping.component.css"],
})
export class PingComponent {
  connection$: WebSocketSubject<any>;
  RETRY_SECONDS = 3;

  offline: boolean = false;

  constructor(
    public config: ConfigService,
    public event: EventService,
    public nav: NavService,
    public rest: RestService,
    public util: UtilService,
    public ui: UIService
  ) {}

  ngOnInit() {
    if (this.config.get("ping")) {
      let url = this.config.get("host");
      console.log(`ping ${url}`);
      this.connect(url).subscribe((x) => {
        console.log(x);
      });
    }
  }

  ngOnDestroy() {
    this.close();
  }

  connect(url): Observable<any> {
    return of(url).pipe(
      filter((url) => !!url),
      // https becomes wws, http becomes ws
      map((url) => url.replace(/^http/, "ws") + "/PING"),
      switchMap((url) => {
        //
        if (this.connection$) {
          return this.connection$;
        } else {
          this.connection$ = webSocket({
            url,
            openObserver: {
              next: () => {
                this.event.send({ name: "online" });
                this.offline = false;
              },
            },
          });

          return this.connection$;
        }
      }),
      retryWhen((errors) =>
        errors.pipe(
          tap((d) => {
            if (d.type == "error" || d.type == "close") {
              // close the connection
              this.close();

              // offline
              this.event.send({ name: "offline" });
              this.offline = true;
            }
          }),
          delayWhen(() => timer(this.RETRY_SECONDS * 1000))
        )
      )
    );
  }

  close() {
    if (this.connection$) {
      this.connection$.complete();
      this.connection$ = null;
    }
  }
}
