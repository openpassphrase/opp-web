import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@app/shared/auth-services';
import { Observable } from 'rxjs';
import { CategoriesQuery, CategoriesService } from './state/categories';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(
    private categoriesService: CategoriesService,
    private categoriesQuery: CategoriesQuery,
    public auth: Auth,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading$ = this.categoriesQuery.selectLoading();

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
