import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PwaService } from '../../core/pwa.service';

@Component({
  selector: 'app-install-pwa',
  templateUrl: './install-pwa.component.html',
  styleUrls: ['./install-pwa.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallPwaComponent {
  constructor(public pwa: PwaService) {}
}
