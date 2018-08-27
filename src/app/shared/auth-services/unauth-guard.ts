import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Auth } from '@app/shared/auth-services/auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable()
export class UnAuthGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) { }

  canActivate() {
    return this.auth.isLoggedIn.pipe(
      take(1),
      map(isLoggedIn => !isLoggedIn),
      tap(isNotLoggedIn => {
        if (!isNotLoggedIn) {
          this.router.navigate(['content']);
        }
      })
    );
  }
}
