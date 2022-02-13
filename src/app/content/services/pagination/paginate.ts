import { combineLatest, Observable, UnaryFunction } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { PaginationService } from './pagination.service';

export function paginate<T extends any[]>(
  pagination: PaginationService
): UnaryFunction<Observable<T | null | undefined>, Observable<T>> {
  return function (source$: Observable<T | null | undefined>): Observable<T> {
    const items$ = source$.pipe(
      tap((items) => {
        pagination.setTotalItemsLength(items?.length ?? 0);
      }),
      filter((x): x is T => !!x)
    );

    return combineLatest([items$, pagination.options$]).pipe(
      map(([items, { pageIndex, pageSize }]) => {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        return items.slice(start, end) as T;
      })
    );
  };
}
