import { Injectable } from '@angular/core';
import { ICategory } from '@app/content/models';
import { EntityState, EntityStore, guid, StoreConfig } from '@datorama/akita';

export interface CategoriesState extends EntityState<ICategory> {
  ui: {
    isPathPhraseCorrect: boolean
  };
  searchFor: string;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'categories' })
export class CategoriesStore extends EntityStore<CategoriesState, ICategory> {
  constructor() {
    const initialState: CategoriesState = {
      loading: false,
      ui: { isPathPhraseCorrect: false },
      searchFor: ''
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
