import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { AuthStateService } from '../../core/auth/auth-state.service';

@Injectable()
export class PhraseIncorrectGuardService {
  private authStateService = inject(AuthStateService);
  private router = inject(Router);

  canActivate() {
    const obs$ = this.authStateService.isPathPhraseCorrect$.pipe(
      map((isCorrect) => !isCorrect),
      tap((isIncorrect) => {
        if (!isIncorrect) {
          this.router.navigate(['your', 'secrets']);
        }
      })
    );

    obs$.subscribe();

    return obs$;
  }
}
