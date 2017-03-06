import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './shared/auth-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public auth: Auth,
    private router: Router
  ) {
    let isLoggedIn: boolean = false;
    this.auth.isLoggedIn.subscribe(newState => {
      if (!newState && isLoggedIn) {
        this.logout();
      }
      isLoggedIn = newState;
    });
  }

  /*secretPhraseChange(secret: string) {
    this.store.dispatch(new category.SecretPhraseChangeAction(secret) as any);
  }*/

  private logout() {
    /*this.store.dispatch(new category.SecretPhraseChangeAction(undefined) as any);
    this.store.dispatch({ type: 'USER_LOGOUT' });*/
    this.router.navigate(['/']);
  }
}
