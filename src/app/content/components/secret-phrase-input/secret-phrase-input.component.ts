import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { filter, first, tap } from 'rxjs/operators';
import { CategoriesQuery, CategoriesService } from '../../state/categories';

@Component({
  selector: 'app-secret-phrase-input',
  templateUrl: './secret-phrase-input.component.html',
  styleUrls: ['./secret-phrase-input.component.scss'],
})
export class SecretPhraseInputComponent implements OnInit {
  @Output() secretPhraseChange = new EventEmitter<string>();
  secretPhrase = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  constructor(
    private categoriesService: CategoriesService,
    private categoriesQuery: CategoriesQuery
  ) {}

  ngOnInit() {
    this.categoriesQuery
      .selectIsPathPhraseCorrect()
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
      this.categoriesService.secretPhraseChange(secret);
      this.secretPhraseChange.emit(secret);
    }
  }
}
