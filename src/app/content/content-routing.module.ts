import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content.component';
import { AuthGuard } from '../shared/auth-services';

const routes: Routes = [
  { path: '', component: ContentComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ContentRoutingModule { }
