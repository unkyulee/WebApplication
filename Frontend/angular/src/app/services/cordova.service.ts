import { Injectable, NgZone, ChangeDetectorRef } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { b64toBlob } from '../core/b64toBlob';

function _window(): any {
  // return the global native browser window object
  return window;
}

// cordova
declare var navigator: any

@Injectable()
export class CordovaService {

  resume: Subject<boolean>;
  constructor(private zone: NgZone) {
    this.resume = new Subject<boolean>();
    fromEvent(document, 'resume').subscribe(event => {
      this.zone.run(() => {
        this.onResume();
      });
    });
  }

  get navigator(): any  {
    return navigator;
  }

  get cordova(): any {
    return _window().cordova;
  }
  get onCordova(): Boolean {
    return !!_window().cordova;
  }
  public onResume(): void {
    this.resume.next(true);
  }

  detectChanges(ref: ChangeDetectorRef) {
    this.zone.run(() => {
      ref.detectChanges();
    });
  }


  // cordova specifics
  async openCamera(option = {}) {
    return new Promise(resolve => {
      this.navigator.camera.getPicture(
        imageData => {
          let file: any = b64toBlob(imageData, "image/jpeg");
          file.name = new Date().getTime().toString() + ".jpg";
          file.lastModified = Date.now();
          resolve(file)
        },
        errorMessage => {
          alert(errorMessage);
          resolve();
        },
        {
          quality: 50,
          correctOrientation: true,
          destinationType: this.navigator.camera.DestinationType.DATA_URL,
          ...option
        }
      );
    })

  }


  async openGallery(option = {}) {
    return new Promise(resolve => {
      this.navigator.camera.getPicture(
        imageData => {
          let file: any = b64toBlob(imageData, "image/jpeg");
          file.name = new Date().getTime().toString() + ".jpg";
          file.lastModified = Date.now();
          resolve(file);
        },
        errorMessage => {
          alert(errorMessage);
        },
        {
          quality: 50,
          correctOrientation: true,
          destinationType: this.navigator.camera.DestinationType.DATA_URL,
          sourceType: this.navigator.camera.PictureSourceType.PHOTOLIBRARY,
          ...option
        }
      );
    })
  }

}