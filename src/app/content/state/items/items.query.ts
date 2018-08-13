import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ItemsStore, ItemsState } from './items.store';
import { IItem } from '@app/content/models';

@Injectable({
  providedIn: 'root'
})
export class ItemsQuery extends QueryEntity<ItemsState, IItem> {

  constructor(protected store: ItemsStore) {
    super(store);
  }

  selectItemsWithoutCategory() {
    return this.selectAll({ filterBy: (e) => e.category_id === undefined });
  }
}
