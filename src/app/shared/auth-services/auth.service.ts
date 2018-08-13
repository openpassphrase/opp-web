import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, timer, of } from 'rxjs';


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
    return this.http.post<{ access_token: string }>(this.location.prepareExternalUrl('api/v1/auth'), data);
  }

  logout() {
    sessionStorage.removeItem('id_token');
  }
}
