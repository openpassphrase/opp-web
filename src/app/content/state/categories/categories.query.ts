import { Injectable } from '@angular/core';
import { ICategory, ICategoryItems, IItem } from '@app/content/models';
import { QueryEntity } from '@datorama/akita';
import { combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ItemsQuery } from '../items';
import { CategoriesState, CategoriesStore } from './categories.store';

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
    return combineLatest([
      this.selectAll(),
      this.itemsQuery.selectAll()
    ]).pipe(
      map(([categories, items]) => categories.map(associateItemsWithCategory(items)))
    );
  }

  selectVisibleCategoryItems() {
    return combineLatest([
      this.selectCategoryItems(),
      this.select(s => s.ui.searchFor)
    ]).pipe(
      map(([categoryItems, searchFor]) => {
        if (!searchFor) {
          return categoryItems;
        }

        return categoryItems
          .map(cat => {
            const categoryMatchesSearch = matchesSearchWord(searchFor)(cat);
            if (categoryMatchesSearch) {
              return cat;
            }
            const c = { ...cat };
            let hasMatchingItem = false;
            c.items = c.items.map(item => {
              const itemMatchesSearch = matchesSearchWord(searchFor)(item);
              if (itemMatchesSearch) {
                hasMatchingItem = true;
              }
              return itemMatchesSearch ? item : { ...item, isHidden: true };
            });

            if (!hasMatchingItem) { c.isHidden = true; }
            return c;
          });
      })
    ).pipe(shareReplay(1));
  }

  selectIsPathPhraseCorrect() {
    return this.select(x => x.ui.isPathPhraseCorrect);
  }
}

function associateItemsWithCategory(items: IItem[]) {
  return (category: ICategory) => {
    const toReturm: ICategoryItems = {
      ...category,
      items: items.filter(x => x.category_id === category.id)
    };
    return toReturm;
  };
}

function matchesSearchWord(searchFor: string | undefined) {
  return (x: ICategory | IItem) => {
    const name = (x.name || '');
    if (!searchFor || !name) { return false; }
    return name.toLocaleLowerCase().indexOf(searchFor.toLocaleLowerCase()) > -1;
  };
}
