import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Used to enforce CSP policy. For more details about CSP, see
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 * and https://developers.google.com/web/fundamentals/security/csp/
 * Evaluate your CSP here: https://csp-evaluator.withgoogle.com/
 * Remove 'unsafe-inline' in style-src once Angular issue is resolved:
 * https://github.com/angular/angular/issues/6361
 */
@Injectable()
export class CspService {
  private doc = inject<Document>(DOCUMENT);

  register() {
    if (environment.name !== 'dev') {
      const meta: HTMLMetaElement = this.doc.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      meta.setAttribute(
        'content',
        `
        default-src 'self';
        font-src 'self' data:;
        style-src 'self' 'unsafe-inline';
        script-src 'self';
        worker-src 'self';
        object-src 'none';
        form-action 'none';
        frame-src 'none';
        `
      );
      this.doc.head.appendChild(meta);
    }
  }
}
