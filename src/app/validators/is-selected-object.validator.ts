import { AbstractControl, ValidatorFn } from '@angular/forms';

export function isSelectedObject(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return (control.value !== null) && control.value.hasOwnProperty('_id') ? null : {
      isSelectedObject: { valid: false }
    };
  };
}
