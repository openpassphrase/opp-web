import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
  exp_delta?: number;
}

export interface LoginResponse {
  access_token: string;
}

abstract class AuthApiServiceBase {
  abstract login(data: LoginRequest): Observable<LoginResponse>;
}

@Injectable()
export class AuthApiService implements AuthApiServiceBase {
  private http = inject(HttpClient);
  private location = inject(Location);

  login(data: LoginRequest) {
    return this.http.post<{ access_token: string }>(
      this.location.prepareExternalUrl('api/v1/auth'),
      data
    );
  }
}

@Injectable()
export class AuthApiMockService implements AuthApiServiceBase {
  login() {
    return of({ access_token: 'access_token' });
  }
}
