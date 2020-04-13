import { Injectable } from "@angular/core";
const { Howl } = require("howler");

@Injectable()
export class UtilService {
  play(src) {
    //
    new Howl({ src: [src] }).play();
  }
}
