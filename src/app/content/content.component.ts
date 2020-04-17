import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { LoadingService } from '../core/loading.service';
import { CategoriesService } from './state/categories';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  private _destroyed = new Subject();

  constructor(
    private categoriesService: CategoriesService,
    private loadingService: LoadingService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loading$ = this.loadingService.isLoading$;
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  logout() {
    this.categoriesService.logout();
    this.auth.logout();
  }
}
