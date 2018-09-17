import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-secrets',
  templateUrl: './secrets.component.html',
  styleUrls: ['./secrets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecretsComponent {
}
