import { Component } from '@angular/core';
import { Auth } from '../shared/auth-services';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  constructor(
    private auth: Auth
  ) { }
}
