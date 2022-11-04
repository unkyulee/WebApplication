import { AbstractControl, NG_VALIDATORS, Validator } from "@angular/forms";
import { Directive } from "@angular/core";

@Directive({
  selector: "[jsonValidate]",
  providers: [
    { provide: NG_VALIDATORS, useExisting: JsonValidator, multi: true },
  ],
})
export class JsonValidator implements Validator {
  validate(c: AbstractControl): { [key: string]: any } {
    c.markAsTouched();
    let error = true;
    try {
      // try to parse json and see if there are any error
      JSON.parse(c.value);
      error = false;
    } catch (e) {
      error = true;
    }
    if (error) return { error: true };

    return { error: false };
  }
}
