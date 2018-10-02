import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-phrase',
  templateUrl: './phrase.component.html',
  styleUrls: ['./phrase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhraseComponent {
}
