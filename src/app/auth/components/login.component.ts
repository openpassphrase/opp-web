import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;
  userNameAutocompleteState = 'off';
  showTokenExp = false;
  loading = false;

  deltaMultiplierOpts = [
    { val: '60', text: 'minutes' },
    { val: '3600', text: 'hours' },
    { val: '86400', text: 'days' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private _fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      exp_delta_amount: [5],
      exp_delta_multiplier: ['60'],
    });

    const exp_delta_amountCtrl = this.authForm.controls['exp_delta_amount'];
    const exp_delta_multiplierCtrl =
      this.authForm.controls['exp_delta_multiplier'];

    exp_delta_amountCtrl.valueChanges.subscribe((newVal) => {
      const notEmpty = newVal !== undefined && newVal !== null && newVal !== '';
      exp_delta_multiplierCtrl.setValidators(
        notEmpty ? Validators.required : null
      );
      exp_delta_multiplierCtrl.updateValueAndValidity({ emitEvent: false });

      if (notEmpty) {
        const intVal = parseInt(newVal);
        this.deltaMultiplierOpts = this.deltaMultiplierOpts.map((opt) => ({
          ...opt,
          text: pluralizeTime(intVal, opt.val),
        }));
      }
    });

    exp_delta_multiplierCtrl.valueChanges.subscribe((newVal) => {
      const notEmpty = newVal !== undefined && newVal !== null && newVal !== '';
      exp_delta_amountCtrl.setValidators(notEmpty ? Validators.required : null);
      exp_delta_amountCtrl.updateValueAndValidity({ emitEvent: false });
    });

    this.userNameAutocompleteState = environment.isUserNameAutocompleteEnabled
      ? 'on'
      : 'off';
    this.showTokenExp = environment.showTokenExpirationCustomization;
  }

  login() {
    if (this.authForm.valid) {
      const toSubmit = {
        username: this.authForm.value.username,
        password: this.authForm.value.password,
        exp_delta:
          this.authForm.value.exp_delta_amount *
          this.authForm.value.exp_delta_multiplier,
      };
      this.loading = true;
      this.auth.login(toSubmit).subscribe(
        // We're assuming the response will be an object
        // with the JWT on an id_token key
        () => {
          this.loading = false;
          this.router.navigate(['your', 'phrase']);
        },
        (error) => {
          console.log('error', error);
          this.loading = false;
          if (error.status === 401) {
            this.snackBar.open('invalid user name or password.', undefined, {
              duration: 6000,
            });
          } else {
            console.error(error);
          }
        }
      );
    }
  }
}

export function pluralizeTime(num: number, multiplier: string) {
  let m = 'minute';
  let h = 'hour';
  let d = 'day';

  if (num > 1) {
    m = m + 's';
    h = h + 's';
    d = d + 's';
  }

  if (multiplier === '60') {
    return m;
  }
  if (multiplier === '3600') {
    return h;
  }
  if (multiplier === '86400') {
    return d;
  }
  throw new Error(`Unexpected value for multiplier: ${multiplier}`);
}
