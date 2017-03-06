import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/from';

import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { BackendService } from '../../services/backend.service';
import * as category from '../actions/categories';
import * as item from '../actions/items';
import { ICategory } from '../../models';

@Injectable()
export class CategoryEffects {

  @Effect()
  loadCategories$: Observable<any> = this.action$
    .filter(a => a instanceof category.LoadCategoriesAction)
    .switchMap(a => this.backend.fetchAll()
      .mergeMap((resp)=> {
        return Observable.from([
            new category.LoadCategoriesSuccessAction(resp.categories),
            new item.LoadItemsSuccessAction(resp.items)
          ]);
      })
      .catch(er => of({}))
    );

  @Effect()
  addCategory$: Observable<any> = this.action$
    .filter(a => a instanceof category.AddCategoryAction)
    .switchMap(a => this.backend.addCategory(a.payload)
      .map(resp => new category.AddCategorySuccessAction(resp))
      .catch(er => {
        return of(new category.AddCategoryFailAction(a.payload));
      })
    )
    .catch((ex) => {
      return of({});
    });

  @Effect()
  editCategory$: Observable<any> = this.action$
    .filter(a => a instanceof category.EditCategoryAction)
    .switchMap(a => this.backend.updateCategory(a.payload)
      .map(resp => new category.EditCategorySuccessAction())
      .catch(er => {
        return of(new category.EditCategoryFailAction(a.payload));
      })
    )
    .catch((ex) => {
      return of({});
    });

  @Effect()
  removeCategory$: Observable<any> = this.action$
    .filter(a => a instanceof category.RemoveCategoryAction)
    .switchMap(a => this.backend.removeCategory({
      id: a.payload.category.id, cascade: a.payload.cascade
    })
      .map(resp => new category.RemoveCategorySuccessAction())
      .catch(er => of(new category.RemoveCategoryFailAction(a.payload)))
    );

  @Effect()
  secretPhraseChange$: Observable<any> = this.action$
    .filter(a => a instanceof category.SecretPhraseChangeAction)
    .map((a) => {
      this.backend.secretPassphraseChange(a.payload);
      if (a.payload !== undefined) {
        return new category.LoadCategoriesAction();
      }
    })
    .catch(er => of({}));

  constructor(private action$: Actions, private backend: BackendService) { }
}
