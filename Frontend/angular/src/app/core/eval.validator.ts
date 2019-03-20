import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";
import {Directive, Input} from "@angular/core";

@Directive({
  selector: '[evalValidate]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: EvalValidator, multi: true }
  ]
})
export class EvalValidator implements Validator {
  @Input('evalValidate') script: string;

  validate(c: AbstractControl): { [key: string]: any; } {
    c.markAsTouched()
    if( this.script ) {
      let value = c.value // used by the evaluation script
      let error = false
      try { error = eval(this.script) }
      catch {}
      if( error )
        return {error: true}
    }
    return null
  }
}