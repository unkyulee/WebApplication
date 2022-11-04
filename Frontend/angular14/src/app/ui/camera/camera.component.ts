// @ts-nocheck
import { Component, ViewChild } from "@angular/core";
import { BaseComponent } from "../base.component";
import obj from "object-path";

@Component({
  selector: "camera",
  templateUrl: "./camera.component.html",
})
export class CameraComponent extends BaseComponent {
  @ViewChild("videoElement") videoElement: any;
  video: any;

  @ViewChild("canvasElement") canvasElement: any;
  canvas: any;

  ngOnInit() {
    super.ngOnInit();

    // event handler
    this.onEvent = this.event.onEvent.subscribe((event) =>
      this.eventHandler(event)
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.onEvent.unsubscribe();
  }

  eventHandler(event) {
    if (
      event &&
      event.name == "screenshot" &&
      (!event.key || event.key == this.uiElement.key)
    ) {
      if (this.uiElement.screenshot) {
        try {
          eval(this.uiElement.screenshot);
        } catch (ex) {
          console.error(ex);
        }
      }
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // init camera
    try {
      let config = {
        video: {
          facingMode: obj.get(this.uiElement, "facingMode", "environment"),
        },
      };
      this.video = this.videoElement.nativeElement;
      navigator.mediaDevices.getUserMedia(config).then((stream) => {
        this.video.srcObject = stream;
      });
    } catch {}

    // init canvas
    this.canvas = this.canvasElement.nativeElement;
  }

  toFile(filename) {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.canvas.getContext("2d").drawImage(this.video, 0, 0);
    let data = this.canvas.toDataURL("image/png");
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
}
