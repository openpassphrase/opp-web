import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { AutofocusDirective } from '../../shared/directives/autofocus';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatProgressBar,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    AutofocusDirective,
    MatSelect,
    NgFor,
    MatOption,
    MatButton,
  ],
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private _fb = inject(UntypedFormBuilder);
  private snackBar = inject(MatSnackBar);

  authForm: UntypedFormGroup;
  userNameAutocompleteState = 'off';
  showTokenExp = false;
  loading = signal(false);

  deltaMultiplierOpts = [
    { val: '60', text: 'minutes' },
    { val: '3600', text: 'hours' },
    { val: '86400', text: 'days' },
  ];

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
      this.loading.set(true);
      this.auth
        .login(toSubmit)
        .pipe(
          tap(() => {
            this.loading.set(false);
            this.router.navigate(['your', 'phrase']);
          }),
          catchError((error) => {
            console.log('error', error);
            this.loading.set(false);
            if (error.status === 401) {
              this.snackBar.open('invalid user name or password.', undefined, {
                duration: 6000,
              });
            } else {
              console.error(error);
            }
            return of(null);
          })
        )
        .subscribe();
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
