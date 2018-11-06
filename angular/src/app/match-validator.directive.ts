import { Directive } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appMatchValidator]'
})
export class MatchValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors {
    return matchValidator(control)
  }
  constructor() { }

}

/** A hero's name can't match the hero's alter ego */
export const matchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const email = control.get('email');
  const emailWdh = control.get('emailWdh');
  const password = control.get('password');
  const passwordWdh = control.get('passwordWdh');

  return email.value === emailWdh.value && password.value === passwordWdh.value ? { 'noMatch': true } : null;
};
