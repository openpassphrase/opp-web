import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthStorage } from '../auth-token-storage';

@Injectable()
export class AuthStateService {
  private readonly isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();
  secret: string | undefined;

  constructor(private router: Router) {}

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
