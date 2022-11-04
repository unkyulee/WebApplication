// @ts-nocheck
import { Component, ViewChild, ElementRef } from "@angular/core";
import SignaturePad from "signature_pad";

// user imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "signature",
  templateUrl: "./signature.component.html",
})
export class SignatureComponent extends BaseComponent {
  constructor(private container: ElementRef) {
    super();
  }

  @ViewChild("signaturePadElement") signaturePadElement;

  signaturePad;
  options: Object = {};

  // this.signaturePad is now available
  ngAfterViewInit() {
    super.ngAfterViewInit();

    //
    this.signaturePad = new SignaturePad(
      this.signaturePadElement.nativeElement,
      {
        backgroundColor: obj.get(this.uiElement, "style.background", "#ebebeb"),
        penColor: obj.get(this.uiElement, "style.color", "rgb(0,0,255)"),
      }
    );

    //
    this.resize();

    // clear to apply the background color
    this.signaturePad.clear();

    // load signature
    if (this.data && this.uiElement.key) {
      this.signaturePad.fromDataURL(this.data[this.uiElement.key]);
    }
  }

  drawStart() {}
  drawComplete() {}

  clear() {
    this.signaturePad.clear();
  }

  save() {
    //
    if (this.uiElement.save) {
      try {
        eval(this.uiElement.save);
      } catch (e) {
        console.error(e);
      }
    }
    // save signature
    else if (this.data && this.uiElement.key) {
      this.data[this.uiElement.key] = this.signaturePad.toDataURL();
      this.event.send({ name: "save" });
    }
  }

  toFile(filename) {
    let data = this.signaturePad.toDataURL();
    data = data.split(",")[1];

    var byteCharacters = atob(data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);

    let blob: any = new Blob([byteArray], { type: "image/png" });
    blob.name = filename;
    blob.lastModified = Date.now();

    return blob;
  }

  // set the dimensions of the signature pad canvas
  resize() {
    this.signaturePad.canvas.width = this.container.nativeElement.clientWidth;
    this.signaturePad.canvas.height = this.container.nativeElement.clientHeight;
  }
}
