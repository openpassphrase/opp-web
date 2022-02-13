import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { PaginationOpts } from './model';

export const DEFAULT_PAGINATION_OPTIONS = new InjectionToken<PaginationOpts>(
  'DEFAULT_PAGINATION_OPTIONS',
  {
    factory: () => ({
      pageIndex: 0,
      pageSize: 10,
    }),
  }
);

@Injectable()
export class PaginationService {
  private options$$ = new BehaviorSubject<PaginationOpts>(this.options);
  private totalItemsLength$$ = new BehaviorSubject<number>(0);

  options$ = this.options$$.asObservable();
  totalItemsLength$ = this.totalItemsLength$$.asObservable();

  pageSize$ = this.options$.pipe(pluck('pageSize'));
  pageIndex$ = this.options$.pipe(pluck('pageIndex'));

  constructor(
    @Inject(DEFAULT_PAGINATION_OPTIONS) private options: PaginationOpts
  ) {}

  updateOptions(opts: Partial<PaginationOpts>) {
    this.options$$.next({
      ...this.options$$.getValue(),
      ...opts,
    });
  }

  setPageIndex(pageIndex: number) {
    this.updateOptions({ pageIndex });
  }

  setPageSize(pageSize: number) {
    this.updateOptions({ pageSize });
  }

  setTotalItemsLength(totalItemsLength: number) {
    this.totalItemsLength$$.next(totalItemsLength);
  }
}
