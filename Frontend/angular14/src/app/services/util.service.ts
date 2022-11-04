import { Injectable } from "@angular/core";
import obj from "object-path";

@Injectable()
export class UtilService {
  isElectron() {
    return (
      window && obj.get(window, "process") && obj.get(window, "process.type")
    );
  }

  isCordova() {
    return window && obj.get(window, "cordova");
  }

  timeout(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  b64toBlob(b64Data, contentType?, sliceSize?) {
    contentType = contentType || "";
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

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
