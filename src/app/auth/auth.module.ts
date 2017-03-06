import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './components/login.component';
import { AuthComponent } from './auth.component';

@NgModule({
  imports: [
    AuthRoutingModule,
    SharedModule,
  ],
  declarations: [
    AuthComponent,
    LoginComponent
  ],
})
export class AuthModule { }
