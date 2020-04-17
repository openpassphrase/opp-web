import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthStorage } from '../auth-token-storage';

@Injectable()
export class AuthStateService {
  private readonly isAuthenticated: BehaviorSubject<boolean>;
  isAuthenticated$: Observable<boolean>;
  secret: string | undefined;

  constructor(private router: Router) {
    const token = AuthStorage.getToken();
    this.isAuthenticated = new BehaviorSubject<boolean>(token !== null);
    this.isAuthenticated$ = this.isAuthenticated.asObservable();
  }

  setAuthenticated(isAuthenticated: false): void;
  setAuthenticated(isAuthenticated: true, access_token: string): void;
  setAuthenticated(isAuthenticated: boolean, access_token?: string) {
    if (isAuthenticated && access_token) {
      AuthStorage.setToken(access_token);
    }
    if (!isAuthenticated) {
      AuthStorage.removeToken();
      this.router.navigate(['/']);
    }
    this.isAuthenticated.next(isAuthenticated);
  }
}
