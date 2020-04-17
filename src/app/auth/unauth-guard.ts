import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../core/auth/auth.service';

@Injectable()
export class UnAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

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
