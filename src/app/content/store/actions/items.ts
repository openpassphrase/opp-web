import { IItem, IUpdateItemPayload, IItemFormResult } from '../../models';
import { BaseAction } from './_baseAction';

export class LoadItemsSuccessAction extends BaseAction {
  constructor(public payload: IItem[]) { super('LoadItemsSuccessAction') }
}

export class AddItemAction extends BaseAction {
  constructor(public payload: IItemFormResult) { super('AddItemAction') }
}

export class AddItemSuccessAction extends BaseAction {
  constructor(public payload: IItem) { super('AddItemSuccessAction') }
}

export class AddItemFailAction extends BaseAction {
  constructor(public payload: IItem) { super('AddItemFailAction') }
}

export class UpdateItemAction extends BaseAction {
  constructor(public payload: IUpdateItemPayload) { super('UpdateItemAction') }
}

export class UpdateItemSuccessAction extends BaseAction {
  constructor(public payload: IItem) { super('UpdateItemSuccessAction') }
}

export class UpdateItemFailAction extends BaseAction {
  constructor(public payload: IItem) { super('UpdateItemFailAction') }
}

export class RemoveItemAction extends BaseAction {
  constructor(public payload: IItem) { super('RemoveItemAction') }
}

export class RemoveItemSuccessAction extends BaseAction {
  constructor() { super('RemoveItemSuccessAction') }
}

export class RemoveItemFailAction extends BaseAction {
  constructor(public payload: IItem) { super('RemoveItemFailAction') }
}

export class RemoveItemsFromCategory extends BaseAction {
  constructor(public payload: number) { super('RemoveItemsFromCategory') }
}

export class SetItemsCategoryByCategoryId extends BaseAction {
  constructor(public payload: { fromCategoryId: number, toCategoryId: number | undefined }) {
     super('SetItemsCategoryByCategoryId')
  }
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
