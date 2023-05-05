// @ts-nocheck
import { Component } from "@angular/core";
import { BaseComponent } from "../base.component";

@Component({
  selector: "uploader",
  templateUrl: "./uploader.component.html",
})
export class UploaderComponent extends BaseComponent {
  onUpload(event) {
    console.log(event);
  }
  uploadUrl(url) {
    try {
      url = eval(url);
    } catch {}
    return url;
  }
}
