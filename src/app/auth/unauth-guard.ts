import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../core/auth/auth.service';

@Injectable()
export class UnAuthGuard {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate() {
    return this.auth.isLoggedIn$.pipe(
      take(1),
      map((isLoggedIn) => !isLoggedIn),
      map((isNotLoggedIn) => {
        return isNotLoggedIn
          ? isNotLoggedIn
          : this.router.createUrlTree(['your', 'phrase']);
      })
    );
  }
}
