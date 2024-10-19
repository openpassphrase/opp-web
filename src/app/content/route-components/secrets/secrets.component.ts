import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoryListComponent } from '../../components/category-list/category-list.component';

@Component({
  selector: 'app-secrets',
  templateUrl: './secrets.component.html',
  styleUrls: ['./secrets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CategoryListComponent],
})
export class SecretsComponent {}
