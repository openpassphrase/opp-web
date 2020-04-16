import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthStateService } from '../../core/auth/auth-state.service';

@Injectable()
export class PhraseInterceptor implements HttpInterceptor {
  constructor(private authStateService: AuthStateService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    request = request.clone({
      setHeaders: {
        'x-opp-phrase': this.authStateService.secret || '',
      },
    });

    return next.handle(request);
  }
}
