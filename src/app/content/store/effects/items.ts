import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/from';

import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { BackendService } from '../../services/backend.service';
import * as item from '../actions/items';

@Injectable()
export class ItemEffects {

  @Effect()
  addItem$ = (<Observable<item.AddItemAction>>this.action$)
    .filter(a => a instanceof item.AddItemAction)
    .switchMap((a) => this.backend.addItem(a.payload)
      .map(resp => new item.AddItemSuccessAction(resp))
      .catch(() => of(new item.AddItemFailAction(a.payload.item)))
    );

  @Effect()
  updateItem$ = (<Observable<item.UpdateItemAction>>this.action$)
    .filter(a => a instanceof item.UpdateItemAction)
    .switchMap((a) => this.backend.updateItem(a.payload.newInfo)
      .map(resp => new item.UpdateItemSuccessAction(resp))
      .catch(() => of(new item.UpdateItemFailAction(a.payload.initialItem)))
    );

  @Effect()
  removeItem$ = (<Observable<item.RemoveItemAction>>this.action$)
    .filter(a => a instanceof item.RemoveItemAction)
    .switchMap((a) => this.backend.removeItem(a.payload.id)
      .map(() => new item.RemoveItemSuccessAction())
      .catch(() => of(new item.RemoveItemFailAction(a.payload)))
    );

  constructor(
    private action$: Actions,
    private backend: BackendService
  ) { }
}
