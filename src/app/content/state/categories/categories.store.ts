import { Injectable } from '@angular/core';
import { ICategory } from '@app/content/models';
import { EntityState, EntityStore, guid, StoreConfig } from '@datorama/akita';

export interface IUiState {
  isPathPhraseCorrect: boolean;
  searchFor: string;
}

export interface CategoriesState extends EntityState<ICategory> {
  ui: IUiState;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'categories' })
export class CategoriesStore extends EntityStore<CategoriesState, ICategory> {
  constructor() {
    const initialState: CategoriesState = {
      loading: false,
      ui: {
        isPathPhraseCorrect: false,
        searchFor: ''
      },
    };
    super(initialState);
  }

  updateUi(ui: Partial<IUiState>) {
    this.update(state => ({ ui: { ...state.ui, ...ui } }));
  }

  optimisticAdd(name: string) {
    const category = { id: guid(), name };
    this.add(category);
    return category.id;
  }

  setIsPathPhraseCorrect(isCorrect: boolean) {
    this.updateUi({ isPathPhraseCorrect: isCorrect });
  }
}
