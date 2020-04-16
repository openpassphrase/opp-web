import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { PhraseInterceptor } from '../content/services/phrase.interceptor';
import { AuthStorage } from './auth-token-storage';
import { AuthApiMockService, AuthApiService } from './auth/auth-api.service';
import { LoadingInterceptor } from './loading.interceptor';

export function tokenGetter() {
  return AuthStorage.getToken();
}

@NgModule({
  imports: [
    HttpClientModule,
    JwtModule.forRoot({
      config: { tokenGetter, headerName: 'x-opp-jwt', authScheme: '' },
    }),
  ],
  providers: [
    {
      provide: AuthApiService,
      useClass: environment.mockApi ? AuthApiMockService : AuthApiService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PhraseInterceptor,
      multi: true,
    },
  ],
})
export class AppHttpModule {}
