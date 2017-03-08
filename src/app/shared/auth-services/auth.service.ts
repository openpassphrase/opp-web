import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { environment } from '../../../environments/environment';

import 'rxjs/add/observable/timer';

const baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}${environment.baseHref}`;

@Injectable()
export class Auth {
  public isLoggedIn: Observable<boolean>;

  constructor(private http: Http) {
    this.isLoggedIn = new Observable<boolean>(s => {
      let prevState = undefined;
      Observable.timer(0, 1000).subscribe(x => {
        const token = sessionStorage.getItem('id_token');
        const isNotExpired = tokenNotExpired('id_token', token);
        if (isNotExpired !== prevState) {
          prevState = isNotExpired;
          s.next(isNotExpired);
        }
      });
    });
  }

  login(data: { username: string, password: string }) {
    return this.http.post(`${baseUrl}/api/v1/auth`, data)
      .map(res => res.json());
  }

  logout() {
    sessionStorage.removeItem('id_token');
  }
}