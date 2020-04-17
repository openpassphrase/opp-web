import { Injectable } from '@angular/core';
import { EntityState, EntityStore, guid, StoreConfig } from '@datorama/akita';
import { ICategory } from '../../models';

export interface IUiState {
  isPathPhraseCorrect: boolean;
  searchFor: string;
}

export interface CategoriesState extends EntityState<ICategory, number> {
  ui: IUiState;
}

@Injectable()
@StoreConfig({ name: 'categories' })
export class CategoriesStore extends EntityStore<CategoriesState> {
  constructor() {
    const initialState: CategoriesState = {
      loading: false,
      ui: {
        isPathPhraseCorrect: false,
        searchFor: '',
      },
    };
    super(initialState);
  }

  updateUi(ui: Partial<IUiState>) {
    this.update((state) => ({ ui: { ...state.ui, ...ui } }));
  }

  optimisticAdd(name: string) {
    const category = { id: guid() as any, name };
    this.add(category);
    return category.id;
  }

  setIsPathPhraseCorrect(isCorrect: boolean) {
    this.updateUi({ isPathPhraseCorrect: isCorrect });
  }
}
