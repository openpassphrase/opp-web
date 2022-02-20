import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export const urlValidator: ValidatorFn = (control: AbstractControl) => {
  if (isPresent(Validators.required(control))) {
    return null;
  }

  const v: string = control.value;
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    v
  )
    ? null
    : { url: true };
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
