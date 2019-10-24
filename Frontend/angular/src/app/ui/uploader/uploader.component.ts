import { Component, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from "rxjs";
import { FileUploader } from "ng2-file-upload";
import { Ng2ImgMaxService } from "ng2-img-max";
import * as obj from "object-path";

// user imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "uploader",
  templateUrl: "./uploader.component.html"
})
export class UploaderComponent extends BaseComponent {
  constructor(private ng2ImgMax: Ng2ImgMaxService) {
    super();
  }

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("cameraInput") cameraInput: ElementRef;

  get value() {
    if (
      this.data &&
      this.data[this.uiElement.key] &&
      this.data[this.uiElement.key].constructor === Array
    )
      return this.data[this.uiElement.key];
    else if (this.data && this.data[this.uiElement.key])
      return [this.data[this.uiElement.key]];

    return [];
  }

  set value(v: any) {
    if (this.data && this.uiElement.key) {
      this.data[this.uiElement.key] = v;
    }
  }

  //
  public uploader: FileUploader;

  // event subscription
  onResume: Subscription;

  //
  timer: any;
  ngOnInit() {
    // set uploader
    this.setUploader();

    // onresume - cordova requires constant montoring on the change detection
    // otherwise it doesn't update its screen .. this happens when coming from camera
    this.onResume = this.cordova.resume.subscribe(event => {
      if (this.timer) clearInterval(this.timer);

      this.timer = setInterval(() => {
        // check changes until the queue is empty
        if (this.uploader && this.uploader.queue.length > 0) {
          this.event.send({ name: "changed" });
        } else if (this.uploader && this.uploader.queue.length == 0) {
          clearInterval(this.timer);
        }
      }, 300);
    });

    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(async event => {
      if (event && event.key == this.uiElement.key) {
        if (event.name == "upload-file") {
          // in case of uploading files open file selection dialog
          // in android open gallery
          if (this.cordova.navigator.camera) {
            let file = await this.cordova.openGallery();
            this.uploadFile(file);
          } else {
            // desktop: initiate file select dialog
            this.fileInput.nativeElement.click();
          }
        } else if (event.name == "upload-camera") {
          // in case of uploading pictures then try to open camera
          if (this.cordova.navigator.camera) {
            let file = await this.cordova.openCamera();
            this.uploadFile(file);
          } else {
            // desktop: initiate image select dialog
            this.cameraInput.nativeElement.click();
          }
        } else if (event.name == "upload") {
          // upload the file sent through the event
          await this.uploadFile(event.file);
        }
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
    this.onResume.unsubscribe();
    clearInterval(this.timer);
  }

  // refresh the table
  async fileSelected(e) {
    // for each selected file perform upload
    for (let f of e.target.files) {
      await this.uploadFile(f);
    }
  }

  async uploadFile(file) {
    if (this.uiElement.image) {
      // process the image if image options exists
      file = await this.processImage(file);
    }

    // upload the file
    if (file) {
      this.uploader.addToQueue([file]);
      this.uploader.uploadAll();
    }
  }

  // if it is an image then
  image_progress = false;
  async processImage(file) {
    if (
      obj.has(this.uiElement, "image.resizeMaxHeight") &&
      obj.has(this.uiElement, "image.resizeMaxWidth")
    ) {
      this.image_progress = true; // show splash
      return new Promise(async resolve => {
        try {
          this.ng2ImgMax
            .resizeImage(
              file,
              this.uiElement.image.resizeMaxHeight,
              this.uiElement.image.resizeMaxWidth
            )
            .subscribe(result => {
              // if it is not mobile then convert to a file object
              if (this.cordova.navigator.camera)
                resolve(result);
              else
                resolve(new File([result], result.name));
            });
        } catch (e) {
          console.error(e);
          this.snackBar.open(e.reason, null, { duration: 2000 });
          resolve(null); // image processing failed
        } finally {
          this.image_progress = false; // hide splash
        }
      });
    }
  }

  // run setUploader when data is ready
  setUploader() {
    // set uploader for
    let url = this.uiElement.upload.url;
    try {
      url = eval(url);
    } catch (e) {}
    let method = this.uiElement.method;
    this.uploader = new FileUploader({
      url: url,
      method: method,
      authToken: eval(this.uiElement.upload.authToken),
      authTokenHeader: eval(this.uiElement.upload.authTokenHeader),
      headers: eval(this.uiElement.upload.headers),
      autoUpload: this.uiElement.autoUpload ? this.uiElement.autoUpload : true
    });

    // when upload is finished
    this.uploader.onSuccessItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => this.onSuccessUpload(item, response, status, headers);
  }

  onSuccessUpload(item: any, response: any, status: any, headers: any): any {
    // try to convert to object
    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error(e);
      return;
    }

    // try to get download path
    let downloadPath = response;
    if (this.uiElement.upload.downloadPathTransform)
      downloadPath = eval(this.uiElement.upload.downloadPathTransform);

    // try to get id
    let id = response;
    if (this.uiElement.upload.idTransform)
      id = eval(this.uiElement.upload.idTransform);

    // save id of the file
    let currentValue = this.value;
    currentValue.push({
      id: id,
      url: downloadPath,
      filename: item.file.name,
      size: item.file.size,
      _created: new Date(),
      _createdBy: this.user.id()
    });
    this.value = currentValue;

    // hide splash
    this.event.send("splash-hide");

    // save if there are no others in the queue
    let index = this.uploader.queue.indexOf(item);
    if (index == this.uploader.queue.length - 1)
      this.event.send({ name: "save" });

    // remove from the queue
    item.remove();
  }
}
