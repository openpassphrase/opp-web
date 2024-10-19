import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { SecretPhraseInputComponent } from '../../components/secret-phrase-input/secret-phrase-input.component';

@Component({
  selector: 'app-phrase',
  templateUrl: './phrase.component.html',
  styleUrls: ['./phrase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCard, MatCardContent, SecretPhraseInputComponent],
})
export class PhraseComponent {}
