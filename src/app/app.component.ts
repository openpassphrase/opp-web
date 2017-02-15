import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './auth/auth.module';
//import { StoreService } from './passwords/services/store.service';
import { Store } from '@ngrx/store';
import * as fromRoot from './reducers';
import * as category from './actions/categories';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public auth: Auth,
    private router: Router,
    private store: Store<fromRoot.State>
  ) {
    let isLoggedIn: boolean = false;
    this.auth.isLoggedIn.subscribe(newState => {
      if (!newState && isLoggedIn) {
        this.logout();
      }
      isLoggedIn = newState;
    });
  }

  secretPhraseChange(secret: string) {
    this.store.dispatch(new category.SecretPhraseChangeAction(secret) as any);
  }

  private logout() {
    this.store.dispatch(new category.SecretPhraseChangeAction(undefined) as any);
    this.store.dispatch({ type: 'USER_LOGOUT' });
    this.router.navigate(['/']);
  }
}
