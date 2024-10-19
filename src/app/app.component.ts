import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CspService } from './core/csp.service';
import { PwaService } from './core/pwa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  private pwa = inject(PwaService);
  private csp = inject(CspService);

  constructor() {
    this.pwa.addManifestLink();
    this.pwa.listenForUpdate();
    this.csp.register();
  }
}
