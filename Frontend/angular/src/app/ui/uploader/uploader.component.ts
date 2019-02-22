import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from "rxjs";
import { FileUploader } from "ng2-file-upload";

// user imports
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";
import { ConfigService } from "src/app/services/config.service";
import { Ng2ImgMaxService } from "ng2-img-max";
import { MatSnackBar } from "@angular/material";
import { UserService } from "src/app/services/user/user.service";

@Component({
  selector: "uploader",
  templateUrl: "./uploader.component.html"
})
export class UploaderComponent {
  @Input() uiElement: any;
  @Input() data: any;

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

  constructor(
    private event: EventService,
    public rest: RestService,
    public config: ConfigService,
    private ng2ImgMax: Ng2ImgMaxService,
    public snackBar: MatSnackBar,
    public user: UserService
  ) {}

  //
  public uploader: FileUploader;

  // event subscription
  eventSubscription: Subscription;
  //
  ngOnInit() {
    // subscript to event
    this.eventSubscription = this.event.onEvent.subscribe(event => {
      if (event && event.key == this.uiElement.key) {
        if (event.name == "upload-file") {
          // initiate file selection
          this.uploadFile();
        } else if (event.name == "upload-camera") {
          // initiate file selection
          this.uploadCamera();
        }
      }
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  uploadCamera() {
    // setup uploader
    this.setUploader();

    // open camera if possible selection
    this.cameraInput.nativeElement.click();
  }

  uploadFile() {
    // setup uploader
    this.setUploader();

    // open file selection
    this.fileInput.nativeElement.click();
  }

  // refresh the table
  change(e) {
    this.event.send("splash-show"); // show splash

    // upload all
    for (let f of e.target.files) {
      if (this.uiElement.image) this.processImage(f);
      else this.processFile(f);
    }
  }

  processFile(file) {
    this.uploader.addToQueue([file]);
    this.uploader.uploadAll();
  }

  processImage(image) {
    if (this.uiElement.resizeMaxHeight || this.uiElement.resizeMaxWidth) {
      this.ng2ImgMax
        .resizeImage(
          image,
          this.uiElement.resizeMaxHeight,
          this.uiElement.resizeMaxWidth
        )
        .subscribe(
          result => {
            const newImage = new File([result], result.name);
            this.uploader.addToQueue([newImage]);
            this.uploader.uploadAll();
          },
          error => {
            this.event.send("splash-hide"); // hide splash
            this.snackBar.open(error.reason, null, { duration: 2000 });
          }
        );
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
      size: item.file.size
    });
    this.value = currentValue;

    // hide splash
    this.event.send("splash-hide");

    // save
    this.event.send({ name: "save" });
  }

  condition() {
    let result = true;
    if (this.uiElement.condition) {
      try {
        result = eval(this.uiElement.condition);
      } catch (e) {
        console.error(e);
      }
    }
    return result;
  }
}

/*



    takePhoto(imgFileInput) {
        this.event.send("splash-show") // show splash
        if (navigator.camera) {
            navigator.camera.getPicture(
                imageData => {
                    let file: any = this.b64toBlob(imageData, 'image/jpeg')
                    file.name = (new Date()).getTime().toString() + '.jpg'
                    file.lastModified = Date.now()

                    this.ng2ImgMax.resizeImage(
                        file
                        , this.uiElement.resizeMaxHeight
                        , this.uiElement.resizeMaxWidth
                    ).subscribe(
                        result => {
                            this.uploader.addToQueue([result]);
                            this.uploader.uploadAll();
                        },
                        error => {
                            this.event.send("splash-hide") // hide splash
                            this.snackBar.open(error.reason, null, { duration: 2000 })
                        }
                    );

                }
                , errorMessage => { alert(errorMessage) }
                , {
                    quality: 50,
                    correctOrientation: true,
                    allowEdit: true,
                    destinationType: navigator.camera.DestinationType.DATA_URL
                }
            );
        }
        else {
            imgFileInput.click()
        }

    }

    b64toBlob(b64Data, contentType?, sliceSize?) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }




}

*/
