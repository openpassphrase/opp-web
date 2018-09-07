import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthStorage } from './auth-token-storage';


@Injectable()
export class AuthMock {
  public isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor() {
    if (AuthStorage.getToken()) {
      this.isLoggedIn.next(true);
    }
  }

  login() {
    return of({ access_token: 'access_token' }).pipe(
      tap(res => {
        AuthStorage.setToken(res.access_token);
        this.isLoggedIn.next(true);
      })
    );
  }

  logout() {
    AuthStorage.removeToken();
    this.isLoggedIn.next(false);
  }
}
