import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';

@Injectable()
export class AuthGuard {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate() {
    return this.auth.isLoggedIn$.pipe(
      take(1),
      map((isLoggedIn) => {
        return isLoggedIn ? isLoggedIn : this.router.createUrlTree(['/']);
      })
    );
  }
}
