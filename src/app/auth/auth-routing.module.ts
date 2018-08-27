import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@app/auth/components/login.component';
import { AuthComponent } from '@app/auth/auth.component';
import { UnAuthGuard } from '@app/shared/auth-services';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [UnAuthGuard],
    children: [
      { path: '',  component: LoginComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AuthRoutingModule { }
