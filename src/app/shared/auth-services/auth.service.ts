import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { environment } from '../../../environments/environment';

import 'rxjs/add/observable/timer';

@Injectable()
export class Auth {
  public isLoggedIn: Observable<boolean>;
  private baseUrl: String;

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
    // Note (alex_bash): This will have to be updated if other routes
    // are added. Currently, only 'content' route exists.
    this.baseUrl = `${window.location.href}`.replace('/content', '');
    if (!this.baseUrl.endsWith('/')) {
      this.baseUrl += '/';
    }  
  }

  login(data: { username: string, password: string }) {
    return this.http.post(`${this.baseUrl}api/v1/auth`, data)
      .map(res => res.json());
  }

  logout() {
    sessionStorage.removeItem('id_token');
  }
}
