import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay, filter, map, retryWhen, switchMap, tap } from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import obj from "object-path";

import { EventService } from "./event.service";
import { connect } from "http2";

@Injectable()
export class WebSocketService {
  constructor(private event: EventService) {}

  connection$: WebSocketSubject<any>;
  RETRY_SECONDS = 10;
  connect(url): Observable<any> {
    return of(url).pipe(
      filter((url) => !!url),
      // https becomes wws, http becomes ws
      map((url) => url.replace(/^http/, "ws") + "/PING"),
      switchMap((wsUrl) => {
        // send online status
        this.event.send({ name: "online" });

        //
        if (this.connection$) {
          return this.connection$;
        } else {
          this.connection$ = webSocket(wsUrl);
          return this.connection$;
        }
      }),
      retryWhen((errors) =>
        errors.pipe(
          tap((d) => {
            if (d.type == "error") {
              // offline
              this.event.send({ name: "offline" });
            }
          }),
          delay(this.RETRY_SECONDS * 1000)
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
