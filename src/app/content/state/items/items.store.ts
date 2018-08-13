import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { IItem } from '@app/content/models';

export interface ItemsState extends EntityState<IItem> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'items' })
export class ItemsStore extends EntityStore<ItemsState, IItem> {

  constructor() {
    super();
  }

  removeForCategory(id: number) {
    this.remove(x => x.category_id === id);
  }

  setCategoryUndefined(categoryId: number) {
    this.update(
      x => x.category_id === categoryId,
      { category_id: undefined }
    );
  }
}

