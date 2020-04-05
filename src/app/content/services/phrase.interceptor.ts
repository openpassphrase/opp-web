import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable()
export class PhraseInterceptor implements HttpInterceptor {
  constructor(private api: BackendService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    request = request.clone({
      setHeaders: {
        'x-opp-phrase': this.api.secret || '',
      },
    });

    return next.handle(request);
  }
}
