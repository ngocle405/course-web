import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { isObject, map, replace } from 'lodash';
import { VALIDATORS_MESSAGE } from 'src/app/core/utils/constants';

@Component({
  selector: 'f-errors',
  templateUrl: './f-errors.component.html',
  styleUrls: ['./f-errors.component.scss'],
})
export class ErrorComponent {
  @Input() control?: UntypedFormControl | AbstractControl | null;

  getListErrors() {
    if (this.control?.touched) {
      return map(this.control?.errors, (value, key) => {
        if ((isObject(value) && key === 'maxlength') || key === 'minlength') {
          return replace(VALIDATORS_MESSAGE[key], '%d', value.requiredLength);
        }
        if ((isObject(value) && key === 'max') || key === 'min') {
          return replace(VALIDATORS_MESSAGE[key], '%d', value[key]);
        } else {
          return VALIDATORS_MESSAGE[key];
        }
      });
    }
    return null;
  }
}
