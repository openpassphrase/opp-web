import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { AuthComponent } from './auth.component';
import { UnAuthGuard } from '../shared/auth-services';

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
