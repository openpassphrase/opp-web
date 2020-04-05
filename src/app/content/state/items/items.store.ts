import { Injectable } from '@angular/core';
import {
  EntityState,
  EntityStore,
  guid,
  ID,
  StoreConfig,
} from '@datorama/akita';
import { IItem } from '../../models';

export interface ItemsState extends EntityState<IItem, number> {}

@Injectable()
@StoreConfig({ name: 'items' })
export class ItemsStore extends EntityStore<ItemsState> {
  constructor() {
    super();
  }

  optimisticAdd(item: IItem) {
    item.id = guid() as any;
    this.add(item);
    return item.id;
  }

  removeForCategory(id: ID) {
    this.remove((x) => x.category_id === id);
  }

  setCategoryUndefined(categoryId: ID) {
    this.update((x) => x.category_id === categoryId, {
      category_id: undefined,
    });
  }
}
