import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/timer';

@Injectable()
export class Auth {
  public isLoggedIn: Observable<boolean>;

  constructor(private http: Http, private location: Location) {
    this.isLoggedIn = new Observable<boolean>(s => {
      let prevState: boolean;
      Observable.timer(0, 1000).subscribe(() => {
        const token = sessionStorage.getItem('id_token');
        const isNotExpired = tokenNotExpired('id_token', token || '');
        if (isNotExpired !== prevState) {
          prevState = isNotExpired;
          s.next(isNotExpired);
        }
      });
    });
  }

  login(data: { username: string, password: string }) {
    return this.http.post(this.location.prepareExternalUrl('api/v1/auth'), data)
      .map(res => res.json());
  }

  logout() {
    sessionStorage.removeItem('id_token');
  }
}
