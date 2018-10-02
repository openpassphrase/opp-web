import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from '@app/content/content.component';
import { PhraseComponent, SecretsComponent } from '@app/content/route-components';
import { PhraseCorrectGuardService, PhraseIncorrectGuardService } from '@app/content/services';
import { AuthGuard } from '@app/shared/auth-services';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'phrase', component: PhraseComponent, canActivate: [PhraseIncorrectGuardService] },
      { path: 'secrets', component: SecretsComponent, canActivate: [PhraseCorrectGuardService] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ContentRoutingModule { }
