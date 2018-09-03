import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from '@app/app-routing.module';
import { SharedModule } from '@app/shared/shared.module';

import { Auth, AuthGuard, UnAuthGuard } from '@app/shared/auth-services';
import { AppComponent } from '@app/app.component';
import { PhraseInterceptor, LoadingInterceptor } from '@app/content/services';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CoreModule } from '@app/core/core.module';
import { PwaService } from '@app/core/pwa.service';

export function tokenGetter() {
  return sessionStorage.getItem('id_token');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: { tokenGetter, headerName: 'x-opp-jwt', authScheme: '' }
    }),
    SharedModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    Auth,
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
export class AppModule {}
