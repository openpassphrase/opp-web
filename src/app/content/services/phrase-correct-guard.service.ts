import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CategoriesQuery } from '@app/content/state/categories';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhraseCorrectGuardService implements CanActivate {
  constructor(private categoriesQuery: CategoriesQuery, private router: Router) { }

  canActivate() {
    return this.categoriesQuery.selectIsPathPhraseCorrect().pipe(
      take(1),
      tap(isCorrect => {
        if (!isCorrect) {
          this.router.navigate(['your', 'phrase']);
        }
      })
    );
  }
}
