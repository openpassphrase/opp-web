import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig, ID, guid } from '@datorama/akita';
import { IItem } from '@app/content/models';

export interface ItemsState extends EntityState<IItem> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'items' })
export class ItemsStore extends EntityStore<ItemsState, IItem> {

  constructor() {
    super();
  }

  optimisticAdd(item: IItem) {
    item.id = guid();
    this.add(item);
    return item.id;
  }

  removeForCategory(id: ID) {
    this.remove(x => x.category_id === id);
  }

  setCategoryUndefined(categoryId: ID) {
    this.update(
      x => x.category_id === categoryId,
      { category_id: undefined }
    );
  }
}

