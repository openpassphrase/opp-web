import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { AuthStateService } from '../../core/auth/auth-state.service';

@Injectable()
export class PhraseCorrectGuardService {
  private authStateService = inject(AuthStateService);
  private router = inject(Router);

  canActivate() {
    return this.authStateService.isPathPhraseCorrect$.pipe(
      take(1),
      tap((isCorrect) => {
        if (!isCorrect) {
          this.router.navigate(['your', 'phrase']);
        }
      })
    );
  }
}
