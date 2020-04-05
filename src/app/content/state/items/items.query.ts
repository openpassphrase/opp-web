import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ItemsState, ItemsStore } from './items.store';

@Injectable()
export class ItemsQuery extends QueryEntity<ItemsState> {
  constructor(protected store: ItemsStore) {
    super(store);
  }

  selectItemsWithoutCategory() {
    return this.selectAll({ filterBy: (e) => e.category_id === undefined });
  }
}
