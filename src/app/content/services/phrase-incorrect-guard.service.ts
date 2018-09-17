import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CategoriesQuery } from '@app/content/state/categories';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhraseIncorrectGuardService implements CanActivate {
  constructor(private categoriesQuery: CategoriesQuery, private router: Router) { }

  canActivate() {
    const obs$ = this.categoriesQuery.selectIsPathPhraseCorrect().pipe(
      map(isCorrect => !isCorrect),
      tap(isIncorrect => {
        if (!isIncorrect) {
          this.router.navigate(['your', 'secrets']);
        }
      })
    );

    obs$.subscribe();

    return obs$;
  }
}
