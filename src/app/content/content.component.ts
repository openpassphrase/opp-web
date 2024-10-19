import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { LoadingService } from '../core/loading.service';
import { AppHeaderComponent } from '../shared/app-header/app.header.component';
import { CategoriesRepository } from './state';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AppHeaderComponent, NgIf, MatProgressBar, RouterOutlet, AsyncPipe],
})
export class ContentComponent {
  private categoriesRepository = inject(CategoriesRepository);
  private loadingService = inject(LoadingService);
  public auth = inject(AuthService);

  loading$ = this.loadingService.isLoading$;

  logout() {
    this.categoriesRepository.secretPhraseChange(undefined);
    this.auth.logout();
  }
}
