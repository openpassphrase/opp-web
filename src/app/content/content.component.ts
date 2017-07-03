import 'rxjs/add/operator/let';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Auth } from '../shared/auth-services';
import { Store } from '@ngrx/store';
import * as fromRoot from './store/reducers';
import * as category from './store/actions/categories';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(
    public store: Store<fromRoot.State>,
    public auth: Auth,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading$ = this.store.let(fromRoot.getLoading);
    this.auth.isLoggedIn.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.logout();
      }
    });
  }

  secretPhraseChange(secret: string) {
    this.store.dispatch(new category.SecretPhraseChangeAction(secret));
  }

  private logout() {
    this.store.dispatch(new category.SecretPhraseChangeAction(undefined));
    this.store.dispatch({ type: 'USER_LOGOUT' });
    this.router.navigate(['/']);
    this.auth.logout();
  }
}
