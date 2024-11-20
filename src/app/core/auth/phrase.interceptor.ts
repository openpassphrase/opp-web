import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthStateService } from './auth-state.service';

@Injectable()
export class PhraseInterceptor implements HttpInterceptor {
  private authStateService = inject(AuthStateService);

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    request = request.clone({
      setHeaders: {
        'x-opp-phrase': this.authStateService.secret || '',
      },
    });

    return next.handle(request);
  }
}
