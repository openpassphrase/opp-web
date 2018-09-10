import { Injectable } from '@angular/core';
import { ICategory, ICategoryItems, IItem } from '@app/content/models';
import { QueryEntity } from '@datorama/akita';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return combineLatest(
      this.selectAll(),
      this.itemsQuery.selectAll(),
      this.select(s => s.searchFor)
    ).pipe(
      map(([categories, items, searchFor]) => {
        const categoryItems = categories.map(associateItemsWithCategory(items));
        if (!searchFor) {
          return categoryItems;
        }

        return categoryItems
          .filter(c => {
            const matchesSearch = matchesSearchWord(searchFor)(c);
            const hasMatchingItem = c.items.some(matchesSearchWord(searchFor));
            return hasMatchingItem || matchesSearch;
          })
          .map(c => {
            const matchesSearch = matchesSearchWord(searchFor)(c);
            if (matchesSearch) { return c; }

            return { ...c, items: c.items.filter(matchesSearchWord(searchFor)) };
          });
      })
    );
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
