import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthStorage } from '../auth-token-storage';

@Injectable()
export class AuthStateService {
  private router = inject(Router);
  private dialog = inject(MatDialog);

  private readonly isAuthenticatedSubj: BehaviorSubject<boolean>;
  private readonly isPathPhraseCorrectSubj = new BehaviorSubject<boolean>(
    false
  );
  isAuthenticated$: Observable<boolean>;
  isPathPhraseCorrect$ = this.isPathPhraseCorrectSubj.asObservable();
  secret: string | undefined;

  constructor() {
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
      this.secret = undefined;
      this.setIsPathPhraseCorrect(false);
      this.router.navigate(['/']);
      this.dialog.closeAll();
    }
    this.isAuthenticatedSubj.next(isAuthenticated);
  }

  secretPassphraseChange(secret: string | undefined) {
    this.secret = secret;
    if (secret === undefined) {
      this.setIsPathPhraseCorrect(false);
    }
  }

  setIsPathPhraseCorrect(isCorrect: boolean) {
    this.isPathPhraseCorrectSubj.next(isCorrect);
  }
}
