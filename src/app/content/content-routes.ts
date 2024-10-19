import { Routes } from '@angular/router';
import { environment } from '../../environments/environment';
import { ContentComponent } from './content.component';
import { PhraseComponent, SecretsComponent } from './route-components';
import { AuthGuard } from './services/auth-guard';
import { BackendMockService } from './services/backend.mock.service';
import { BackendService } from './services/backend.service';
import { PhraseCorrectGuardService } from './services/phrase-correct-guard.service';
import { PhraseIncorrectGuardService } from './services/phrase-incorrect-guard.service';
import { CategoriesRepository } from './state';

export const ROUTES: Routes = [
  {
    path: '',
    component: ContentComponent,
    canActivate: [AuthGuard],
    providers: [
      AuthGuard,
      {
        provide: BackendService,
        useClass: environment.mockApi ? BackendMockService : BackendService,
      },
      CategoriesRepository,
    ],
    children: [
      {
        path: 'phrase',
        component: PhraseComponent,
        canActivate: [PhraseIncorrectGuardService],
        providers: [PhraseIncorrectGuardService],
      },
      {
        path: 'secrets',
        component: SecretsComponent,
        canActivate: [PhraseCorrectGuardService],
        providers: [PhraseCorrectGuardService],
      },
    ],
  },
];
