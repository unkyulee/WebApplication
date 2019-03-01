import { Injectable, NgZone, ChangeDetectorRef } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';

function _window(): any {
  // return the global native browser window object
  return window;
}

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
}