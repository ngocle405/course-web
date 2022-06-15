import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[noSpace]',
  providers: [{ provide: NG_VALIDATORS, useExisting: InputNoSpaceValidatorDirective, multi: true }],
})
export class InputNoSpaceValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.toString().indexOf(' ') >= 0) {
      return { noSpace: true };
    }
    return null;
  }
}
