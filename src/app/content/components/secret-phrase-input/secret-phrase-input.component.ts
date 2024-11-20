import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { NGX_ERRORS_MATERIAL_DECLARATIONS } from '@ngspot/ngx-errors-material';
import { filter, first, tap } from 'rxjs/operators';

import { MatInput } from '@angular/material/input';
import { AuthStateService } from '../../../core/auth/auth-state.service';
import { AutofocusDirective } from '../../../shared/directives/autofocus';
import { CategoriesRepository } from '../../state';

@Component({
  selector: 'app-secret-phrase-input',
  templateUrl: './secret-phrase-input.component.html',
  styleUrls: ['./secret-phrase-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    AutofocusDirective,
    MatHint,
    MatError,
    MatButton,
    NGX_ERRORS_MATERIAL_DECLARATIONS,
  ],
})
export class SecretPhraseInputComponent implements OnInit {
  private categoriesRepository = inject(CategoriesRepository);
  private authStateService = inject(AuthStateService);

  @Output() secretPhraseChange = new EventEmitter<string>();
  secretPhrase = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  ngOnInit() {
    this.authStateService.isPathPhraseCorrect$
      .pipe(
        filter((isCorrect) => !!isCorrect),
        tap(() => {
          this.secretPhrase.setValue('');
        }),
        first()
      )
      .subscribe();
  }

  submit() {
    if (this.secretPhrase.valid) {
      const secret = this.secretPhrase.value;
      this.categoriesRepository.secretPhraseChange(secret);
      this.secretPhraseChange.emit(secret);
    }
  }
}
