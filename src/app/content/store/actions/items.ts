import { IItem, IUpdateItemPayload, IItemFormResult } from '../../models';

export class LoadItemsSuccessAction {
  constructor(public payload: IItem[]) { }
}

export class AddItemAction {
  constructor(public payload: IItemFormResult) { }
}

export class AddItemSuccessAction {
  constructor(public payload: IItem) { }
}

export class AddItemFailAction {
  constructor(public payload: IItem) { }
}

export class UpdateItemAction {
  constructor(public payload: IUpdateItemPayload) { }
}

export class UpdateItemSuccessAction {
  constructor(public payload: IItem) { }
}

export class UpdateItemFailAction {
  constructor(public payload: IItem) { }
}

export class RemoveItemAction {
  constructor(public payload: IItem) { }
}

export class RemoveItemSuccessAction {
  constructor() { }
}

export class RemoveItemFailAction {
  constructor(public payload: IItem) { }
}

export class RemoveItemsFromCategory {
  constructor(public payload: number) { }
}

export class SetItemsCategoryByCategoryId {
  constructor(public payload: { fromCategoryId: number, toCategoryId: number }) { }
}

export type Actions
  = LoadItemsSuccessAction
  | AddItemAction
  | AddItemSuccessAction
  | AddItemFailAction
  | UpdateItemAction
  | UpdateItemSuccessAction
  | UpdateItemFailAction
  | RemoveItemAction
  | RemoveItemSuccessAction
  | RemoveItemFailAction
  | RemoveItemsFromCategory
  | SetItemsCategoryByCategoryId;
