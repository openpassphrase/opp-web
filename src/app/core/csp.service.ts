import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable()
export class CspService {
  constructor(
    @Inject(DOCUMENT) private doc: Document
  ) { }

  register() {
    if (environment.name !== 'dev') {
      const meta: HTMLMetaElement = this.doc.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      meta.setAttribute(
        'content',
        `default-src 'self';
         child-src 'none';
         font-src 'self' data:;
         style-src 'unsafe-inline';
         script-src 'self' 'unsafe-eval'`
      );
      this.doc.head.appendChild(meta);
    }
  }
}
