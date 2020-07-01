import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { AuthStateService } from '../../core/auth/auth-state.service';

@Injectable()
export class PhraseCorrectGuardService implements CanActivate {
  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {}

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
