import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable()
export class LogService {
  constructor() {
    this.add("info", "Init Log Service")
  }

  // logs
  public logs = [];
  size = 100;

  add(type, msg, ex = null) {
    this.logs.unshift({
      type,
      msg,
      ex,
      stack: new Error().stack,
      datetime: moment().format("YYYY-MM-DD hh:mm:ss"),
    });

    // check log size
    while (this.logs.length > 100) this.logs.pop();
  }
}
