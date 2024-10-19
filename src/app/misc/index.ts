import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export const urlValidator: ValidatorFn = (control: AbstractControl) => {
  if (isPresent(Validators.required(control))) {
    return null;
  }

  const v: string = control.value;
  try {
    new URL(v);
    return null;
  } catch (err) {
    return { url: true };
  }
};

export function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

/**
 * Generate random guid
 *
 * @example
 *
 * {
 *   id: guid()
 * }
 *
 * @remarks this isn't a GUID, but a 10 char random alpha-num
 */
export function guid() {
  return Math.random().toString(36).slice(2);
}
