import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Auth } from '@app/shared/auth-services';
import { CategoriesQuery, CategoriesService } from './state/categories';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit {
  loading$: Observable<boolean>;
  isPathPhraseIncorrect$: Observable<boolean>;

  constructor(
    private categoriesService: CategoriesService,
    private categoriesQuery: CategoriesQuery,
    public auth: Auth,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading$ = this.categoriesQuery.selectLoading();
    this.isPathPhraseIncorrect$ = this.categoriesQuery.selectIsPathPhraseCorrect().pipe(
      map(isCorrect => !isCorrect)
    );

    this.auth.isLoggedIn.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.logout();
      }
    });
  }

  logout() {
    this.categoriesService.logout();
    this.router.navigate(['/']);
    this.auth.logout();
  }
}
