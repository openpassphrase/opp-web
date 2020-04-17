import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content.component';
import { PhraseComponent, SecretsComponent } from './route-components';
import { AuthGuard } from './services/auth-guard';
import { PhraseCorrectGuardService } from './services/phrase-correct-guard.service';
import { PhraseIncorrectGuardService } from './services/phrase-incorrect-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'phrase',
        component: PhraseComponent,
        canActivate: [PhraseIncorrectGuardService],
      },
      {
        path: 'secrets',
        component: SecretsComponent,
        canActivate: [PhraseCorrectGuardService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    PhraseCorrectGuardService,
    PhraseIncorrectGuardService,
    AuthGuard,
  ],
})
export class ContentRoutingModule {}
