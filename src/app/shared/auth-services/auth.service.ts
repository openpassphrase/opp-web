import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthStorage } from './auth-token-storage';


@Injectable()
export class Auth {
  public isLoggedIn: Observable<boolean> = of(true);

  constructor(
    private http: HttpClient,
    private location: Location,
    jwtHelper: JwtHelperService
  ) {
    this.isLoggedIn = new Observable<boolean>(s => {
      let prevState: boolean;
      timer(0, 1000).subscribe(() => {
        const isNotExpired = !(jwtHelper.isTokenExpired());
        if (isNotExpired !== prevState) {
          prevState = isNotExpired;
          s.next(isNotExpired);
        }
      });
    });
  }

  login(data: { username: string, password: string }) {
    return this.http.post<{ access_token: string }>(this.location.prepareExternalUrl('api/v1/auth'), data).pipe(
      tap(res => AuthStorage.setToken(res.access_token))
    );
  }

  logout() {
    AuthStorage.removeToken();
  }
}
