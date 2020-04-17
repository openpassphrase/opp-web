import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    return this.auth.isLoggedIn$.pipe(
      take(1),
      map((isLoggedIn) => {
        return isLoggedIn ? isLoggedIn : this.router.createUrlTree(['/']);
      })
    );
  }
}
