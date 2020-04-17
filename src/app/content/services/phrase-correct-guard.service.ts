import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { CategoriesQuery } from '../state/categories';

@Injectable()
export class PhraseCorrectGuardService implements CanActivate {
  constructor(
    private categoriesQuery: CategoriesQuery,
    private router: Router
  ) {}

  canActivate() {
    return this.categoriesQuery.selectIsPathPhraseCorrect().pipe(
      take(1),
      tap((isCorrect) => {
        if (!isCorrect) {
          this.router.navigate(['your', 'phrase']);
        }
      })
    );
  }
}
