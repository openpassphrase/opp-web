import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthStorage } from '../auth-token-storage';

@Injectable()
export class AuthStateService {
  private readonly isAuthenticatedSubj: BehaviorSubject<boolean>;
  isAuthenticated$: Observable<boolean>;
  secret: string | undefined;

  constructor(private router: Router, private dialog: MatDialog) {
    const token = AuthStorage.getToken();
    const sessionExpirationTime = AuthStorage.getSessionExpirationTime();
    const isAuthed =
      token !== null &&
      sessionExpirationTime !== undefined &&
      sessionExpirationTime > new Date().getTime();
    this.isAuthenticatedSubj = new BehaviorSubject<boolean>(isAuthed);
    this.isAuthenticated$ = this.isAuthenticatedSubj.asObservable();
  }

  setAuthenticated(isAuthenticated: false): void;
  setAuthenticated(
    isAuthenticated: true,
    access_token: string,
    sessionExpireAt: number
  ): void;
  setAuthenticated(
    isAuthenticated: boolean,
    access_token?: string,
    sessionExpireAt?: number
  ) {
    if (isAuthenticated && access_token && sessionExpireAt) {
      AuthStorage.setToken(access_token, sessionExpireAt);
    }
    if (!isAuthenticated) {
      AuthStorage.removeToken();
      this.router.navigate(['/']);
      this.dialog.closeAll();
    }
    this.isAuthenticatedSubj.next(isAuthenticated);
  }
}
