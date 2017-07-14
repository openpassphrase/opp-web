import '@ngrx/core/add/operator/select';
import { Observable } from 'rxjs/Observable';
import { ICategory } from '../../models';
import * as category from '../actions/categories';

export interface State {
  loading: boolean;
  isCorrectPhrase: boolean;
  categories: ICategory[];
}

const initialState: State = {
  loading: false,
  isCorrectPhrase: false,
  categories: [],
};

export function reducer(state = initialState, action: category.Actions): State {
  if (action instanceof category.LoadCategoriesAction) {
    return Object.assign({}, state, {
      loading: true,
      isCorrectPhrase: false,
      categories: []
    });
  } else if (action instanceof category.LoadCategoriesSuccessAction) {
    return Object.assign({}, state, {
      loading: false,
      isCorrectPhrase: true,
      categories: [...action.payload]
    });
  } else if (action instanceof category.LoadCategoriesFailAction) {
    return Object.assign({}, state, {
      loading: false,
      isCorrectPhrase: false,
      categories: []
    });
  } else if (action instanceof category.AddCategoryAction) {
    return Object.assign({}, state, {
      loading: true,
      categories: [...state.categories, { id: -1, name: action.payload }]
    });
  } else if (action instanceof category.AddCategoryFailAction) {
    return Object.assign({}, state, {
      loading: false,
      categories: state.categories.filter(c => c.id !== -1 && c.name !== action.payload)
    });
  } else if (action instanceof category.AddCategorySuccessAction) {
    return Object.assign({}, state, {
      loading: false,
      categories: state.categories.map(c => {
        return c.id === -1 && c.name === action.payload.name
          ? Object.assign({}, c, { id: action.payload.id })
          : c;
      })
    });
  } else if (action instanceof category.EditCategoryAction) {
    return Object.assign({}, state, {
      loading: true,
      categories: state.categories.map(c => {
        return c.id === action.payload.id
          ? Object.assign({}, c, { name: action.payload.name })
          : c;
      })
    });
  } else if (action instanceof category.EditCategorySuccessAction) {
    return Object.assign({}, state, {
      loading: false,
      categories: state.categories
    });
  } else if (action instanceof category.EditCategoryFailAction) {
    return Object.assign({}, state, {
      loading: false,
      categories: state.categories.map(c => {
        return c.id === action.payload.id
          ? Object.assign({}, c, { name: action.payload.initialName })
          : c;
      })
    });
  } else if (action instanceof category.RemoveCategoryAction) {
    return Object.assign({}, state, {
      loading: true,
      categories: state.categories.filter(c => c.id !== action.payload.category.id)
    });
  } else if (action instanceof category.RemoveCategoryFailAction) {
    return Object.assign({}, state, {
      loading: false,
      categories: [...state.categories, action.payload.category]
    });
  } else if (action instanceof category.RemoveCategorySuccessAction) {
    return Object.assign({}, state, {
      loading: false,
      categories: state.categories
    });
  } else if (action instanceof category.SecretPhraseChangeAction) {
    return Object.assign({}, state, {
      loading: state.loading,
      categories: []
    });
  } else {
    return state;
  }
}

export function getCategories(state$: Observable<State>) {
  return state$.select(s => s.categories);
}

export function getLoading(state$: Observable<State>) {
  return state$.select(s => s.loading);
}

export function getIsCorrectPhrase(state$: Observable<State>) {
  return state$.select(s => s.isCorrectPhrase);
}
