import { Injectable } from "@angular/core";
import obj from "object-path";

@Injectable()
export class UtilService {
  isElectron() {
    return (
      window && obj.get(window, "process") && obj.get(window, "process.type")
    );
  }

  isCordova() {
    return window && obj.get(window, "cordova");
  }

  timeout(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
