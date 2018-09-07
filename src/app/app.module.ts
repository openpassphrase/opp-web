import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { LoadingInterceptor, PhraseInterceptor } from '@app/content/services';
import { CoreModule } from '@app/core/core.module';
import { Auth, AuthGuard, AuthMock, AuthStorage, UnAuthGuard } from '@app/shared/auth-services';
import { SharedModule } from '@app/shared/shared.module';
import { JwtModule } from '@auth0/angular-jwt';

import { environment } from '../environments/environment';

export function tokenGetter() {
  return AuthStorage.getToken();
}

const swJs = `${environment.baseHref}/ngsw-worker.js`;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: { tokenGetter, headerName: 'x-opp-jwt', authScheme: '' }
    }),
    SharedModule,
    ServiceWorkerModule.register(swJs, { enabled: environment.name !== 'dev' })
  ],
  providers: [
    { provide: Auth, useClass: environment.mockApi ? AuthMock : Auth },
    AuthGuard,
    UnAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PhraseInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
