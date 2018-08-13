import { NgModule } from '@angular/core';

import { AuthRoutingModule } from '@app/auth/auth-routing.module';
import { SharedModule } from '@app/shared/shared.module';

import { LoginComponent } from '@app/auth/components/login.component';
import { AuthComponent } from '@app/auth/auth.component';

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
