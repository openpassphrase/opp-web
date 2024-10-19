import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login.component';
import { UnAuthGuard } from './unauth-guard';

export const ROUTES: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [UnAuthGuard],
    providers: [UnAuthGuard],
    children: [{ path: '', component: LoginComponent }],
  },
];
