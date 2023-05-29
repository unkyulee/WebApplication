// @ts-nocheck
import { Component } from "@angular/core";
import { BaseComponent } from "../base.component";
import { NgxImageCompressService } from "ngx-image-compress";

@Component({
  selector: "uploader",
  templateUrl: "./uploader.component.html",
})
export class UploaderComponent extends BaseComponent {
  constructor(private imageCompress: NgxImageCompressService) {
    super();
  }

  onUpload(event) {
    if (this.uiElement.onUpload) {
      eval(this.uiElement.onUpload);
    }
  }
  onBeforeUpload(event) {
    if (this.uiElement.onBeforeUpload) {
      eval(this.uiElement.onBeforeUpload);
    }
  }
  onSelect(event) {
    if (this.uiElement.onSelect) {
      eval(this.uiElement.onSelect);
    }
  }
  uploadUrl(url) {
    try {
      url = eval(url);
    } catch {}
    return url;
  }
}
