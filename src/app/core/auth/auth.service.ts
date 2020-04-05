import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject, timer } from 'rxjs';
import { map, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthApiService } from './auth-api.service';
import { AuthStateService } from './auth-state.service';

@Injectable()
export class AuthService {
  isLoggedIn$ = this.authStateService.isAuthenticated$;
  private logoutClicked = new Subject();

  constructor(
    private authApiService: AuthApiService,
    private authStateService: AuthStateService,
    private jwtHelper: JwtHelperService
  ) {}

  login(data: { username: string; password: string; exp_delta: number }) {
    return this.authApiService.login(data).pipe(
      tap((res) => {
        this.authStateService.setAuthenticated(true, res.access_token);

        this.checkForTokenExpiration(data.exp_delta);
      })
    );
  }

  logout() {
    this.logoutClicked.next();
    this.authStateService.setAuthenticated(false);
  }

  /**
   * Wait the amount of time user set for expiration of session - 5seconds.
   * After that start a timer checking if session has expired every second.
   *
   * @param exp_delta amount of time in minutes / 1000
   * that user selected to wait before session expiration
   */
  private checkForTokenExpiration(exp_delta: number | undefined) {
    const seconds5 = 5 * 1000;
    const minutes5 = seconds5 * 60; // default timeout time
    const sessionExpireIn = exp_delta ? exp_delta * 1000 : minutes5;
    const startFrom = sessionExpireIn - seconds5;

    timer(startFrom, 1000)
      .pipe(
        // stop subscription in case user logs out manually
        takeUntil(this.logoutClicked),
        // check if token expired
        map(() =>
          environment.mockApi ? true : this.jwtHelper.isTokenExpired()
        ),
        // if expired, sign out user
        tap((isExpired) => {
          if (isExpired) {
            this.authStateService.setAuthenticated(false);
          }
        }),
        // keep timer loop every second while session not expired
        takeWhile((isExpired) => !isExpired)
      )
      .subscribe();
  }
}
