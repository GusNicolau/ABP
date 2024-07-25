import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;  // Si el control está vacío, no hay error.
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasMinLength = value.length >= 7;

    const passwordValid = hasUpperCase && hasNumber && hasMinLength;

    return !passwordValid ? { passwordStrength: true } : null;
  };
}
