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

  match(str, rule) {
    // "."  => Find a single character, except newline or line terminator
    // ".*" => Matches any string that contains zero or more characters
    rule = rule.split("*").join(".*");

    // "^"  => Matches any string with the following at the beginning of it
    // "$"  => Matches any string with that in front at the end of it
    rule = "^" + rule + "$";

    //Create a regular expression object for matching string
    var regex = new RegExp(rule);

    //Returns true if it finds a match, otherwise it returns false
    return regex.test(str);
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  /**
   * range()
   *
   * Returns an array of numbers between a start number and an end number incremented
   * sequentially by a fixed number(step), beginning with either the start number or
   * the end number depending on which is greater.
   *
   * @param {number} start (Required: The start number.)
   * @param {number} end (Required: The end number. If end is less than start,
   *  then the range begins with end instead of start and decrements instead of increment.)
   * @param {number} step (Optional: The fixed increment or decrement step. Defaults to 1.)
   *
   * @return {array} (An array containing the range numbers.)
   *
   * @throws {TypeError} (If any of start, end and step is not a finite number.)
   * @throws {Error} (If step is not a positive number.)
   */
  range(start, end, step = 1) {
    // Test that the first 3 arguments are finite numbers.
    // Using Array.prototype.every() and Number.isFinite().
    const allNumbers = [start, end, step].every(Number.isFinite);

    // Throw an error if any of the first 3 arguments is not a finite number.
    if (!allNumbers) {
      throw new TypeError("range() expects only finite numbers as arguments.");
    }

    // Ensure the step is always a positive number.
    if (step <= 0) {
      throw new Error("step must be a number greater than 0.");
    }

    // When the start number is greater than the end number,
    // modify the step for decrementing instead of incrementing.
    if (start > end) {
      step = -step;
    }

    // Determine the length of the array to be returned.
    // The length is incremented by 1 after Math.floor().
    // This ensures that the end number is listed if it falls within the range.
    const length = Math.floor(Math.abs((end - start) / step)) + 1;

    // Fill up a new array with the range numbers
    // using Array.from() with a mapping function.
    // Finally, return the new array.
    return Array.from(Array(length), (x, index) => start + index * step);
  }
}
