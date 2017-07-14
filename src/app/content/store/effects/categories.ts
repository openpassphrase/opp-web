import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/from';

import { MdSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { BackendService } from '../../services/backend.service';
import * as category from '../actions/categories';
import * as item from '../actions/items';

@Injectable()
export class CategoryEffects {

  @Effect()
  loadCategories$ = (<Observable<category.Actions>>this.action$)
    .filter<category.LoadCategoriesAction>(a => a instanceof category.LoadCategoriesAction)
    .switchMap(() => this.backend.fetchAll()
      .mergeMap((resp) => {
        return Observable.from([
          new category.LoadCategoriesSuccessAction(resp.categories),
          new item.LoadItemsSuccessAction(resp.items)
        ]);
      })
      .catch(() => {
         this.snackbar.open('Incorrect passphrase', undefined, { duration: 2000 });
         return of(new category.LoadCategoriesFailAction());
      })
    );

  @Effect()
  addCategory$ = (<Observable<category.AddCategoryAction>>this.action$)
    .filter(a => a instanceof category.AddCategoryAction)
    .switchMap(a => this.backend.addCategory(a.payload)
      .map(resp => new category.AddCategorySuccessAction(resp))
      .catch(er => {
        console.log(er);
        return of(new category.AddCategoryFailAction(a.payload));
      })
    )
    .catch((ex) => {
      console.log(ex);
      return of({});
    });

  @Effect()
  editCategory$ = (<Observable<category.EditCategoryAction>>this.action$)
    .filter(a => a instanceof category.EditCategoryAction)
    .switchMap(a => this.backend.updateCategory(a.payload)
      .map(() => new category.EditCategorySuccessAction())
      .catch(er => {
        console.log(er);
        return of(new category.EditCategoryFailAction(a.payload));
      })
    )
    .catch((ex) => {
      console.log(ex);
      return of({});
    });

  @Effect()
  removeCategory$ = (<Observable<category.RemoveCategoryAction>>this.action$)
    .filter(a => a instanceof category.RemoveCategoryAction)
    .switchMap(a => this.backend.removeCategory({
      id: a.payload.category.id, cascade: a.payload.cascade
    })
      .map(() => new category.RemoveCategorySuccessAction())
      .catch(() => of(new category.RemoveCategoryFailAction(a.payload)))
    );

  @Effect()
  secretPhraseChange$ = (<Observable<category.SecretPhraseChangeAction>>this.action$)
    .filter(a => a instanceof category.SecretPhraseChangeAction)
    .map((a) => {
      this.backend.secretPassphraseChange(a.payload);
      if (a.payload !== undefined) {
        return new category.LoadCategoriesAction();
      }
    })
    .catch(() => of({}));

  constructor(
    private action$: Actions,
    private backend: BackendService,
    private snackbar: MdSnackBar
  ) { }
}
