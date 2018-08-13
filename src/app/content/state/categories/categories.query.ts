import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CategoriesStore, CategoriesState } from './categories.store';
import { ItemsQuery } from '../items';
import { ICategory, ICategoryItems } from '@app/content/models';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesQuery extends QueryEntity<CategoriesState, ICategory> {
  constructor(
    protected store: CategoriesStore,
    private itemsQuery: ItemsQuery
  ) {
    super(store);
  }

  selectCategoryItems() {
    return combineLatest(
      this.selectAll(),
      this.itemsQuery.selectAll()
    ).pipe(
      map(([categories, items]) => {
        return categories.map(c => {
          const toReturm: ICategoryItems = {
            ...c,
            items: items.filter(x => x.category_id === c.id)
          };
          return toReturm;
        });
      })
    );
  }

  selectIsPathPhraseCorrect() {
    return this.select(x => x.ui.isPathPhraseCorrect);
  }
}
