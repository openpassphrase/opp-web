import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig, guid } from '@datorama/akita';
import { ICategory } from '@app/content/models';

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
    const category = { id: guid(), name };
    this.add(category);
    return category.id;
  }

  setIsPathPhraseCorrect(isCorrect: boolean) {
    this.updateRoot({ ui: { isPathPhraseCorrect: isCorrect } });
  }
}
