import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { filter, first, tap } from 'rxjs/operators';
import { AuthStateService } from '../../../core/auth/auth-state.service';
import { CategoriesRepository } from '../../state';

@Component({
  selector: 'app-secret-phrase-input',
  templateUrl: './secret-phrase-input.component.html',
  styleUrls: ['./secret-phrase-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecretPhraseInputComponent implements OnInit {
  @Output() secretPhraseChange = new EventEmitter<string>();
  secretPhrase = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  constructor(
    private categoriesRepository: CategoriesRepository,
    private authStateService: AuthStateService
  ) {}

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
