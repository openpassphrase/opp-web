import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ICategory } from '@app/content/models';
import * as uuid from 'uuid/v4';

export interface CategoriesState extends EntityState<ICategory> {
  ui: {
    isPathPhraseCorrect: boolean
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'categories' })
export class CategoriesStore extends EntityStore<CategoriesState, ICategory> {
  ui: {
    isPathPhraseCorrect: true
  };

  constructor() {
    const initialState = {
      loading: false,
      ui: { isPathPhraseCorrect: false }
    };
    super(initialState);
  }

  optimisticAdd(name: string) {
    const category = { id: -1, name, dirty: uuid() };
    this.add(category);
    return category.dirty;
  }

  updateOptimistic(dirty: string, categoryId: number) {
    this.update(e => e.dirty === dirty, { id: categoryId });
  }

  deleteOptimistic(dirty: string) {
    this.remove(e => e.dirty === dirty);
  }

  setIsPathPhraseCorrect(isCorrect: boolean) {
    this.updateRoot({ ui: { isPathPhraseCorrect: isCorrect } });
  }
}

