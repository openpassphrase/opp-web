import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.name !== 'dev') {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false,
    ngZoneEventCoalescing: true,
    ngZoneRunCoalescing: true,
  })
  .catch((err) => console.log(err));
