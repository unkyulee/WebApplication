import { Injectable } from "@angular/core";
import { Howl } from "howler"

@Injectable()
export class UtilService {
  play(src) {
    //
    new Howl({ src: [src] }).play();
  }
}
