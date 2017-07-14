import { BaseAction } from './_baseAction';
import { ICategory, IUpdateCategoryPayload, IRemoveCategoryPayload } from '../../models';

export class SecretPhraseChangeAction extends BaseAction {
  constructor(public payload: string | undefined) { super('SecretPhraseChangeAction') }
}

export class LoadCategoriesAction extends BaseAction {
  constructor() { super('LoadCategoriesAction') }
}

export class LoadCategoriesSuccessAction extends BaseAction {
  constructor(public payload: ICategory[]) { super('LoadCategoriesSuccessAction') }
}

export class LoadCategoriesFailAction extends BaseAction {
  constructor() { super('LoadCategoriesFailAction') }
}

export class AddCategoryAction extends BaseAction {
  constructor(public payload: string) { super('AddCategoryAction') }
}

export class AddCategorySuccessAction extends BaseAction {
  constructor(public payload: ICategory) { super('AddCategorySuccessAction') }
}

export class AddCategoryFailAction extends BaseAction {
  constructor(public payload: string) { super('AddCategoryFailAction') }
}

export class EditCategoryAction extends BaseAction {
  constructor(public payload: IUpdateCategoryPayload) { super('EditCategoryAction') }
}

export class EditCategorySuccessAction extends BaseAction {
  constructor() { super('EditCategorySuccessAction') }
}

export class EditCategoryFailAction extends BaseAction {
  constructor(public payload: IUpdateCategoryPayload) { super('EditCategoryFailAction') }
}

export class RemoveCategoryAction extends BaseAction {
  constructor(public payload: IRemoveCategoryPayload) { super('RemoveCategoryAction') }
}

export class RemoveCategorySuccessAction extends BaseAction {
  constructor() { super('RemoveCategorySuccessAction') }
}

export class RemoveCategoryFailAction extends BaseAction {
  constructor(public payload: IRemoveCategoryPayload) { super('RemoveCategoryFailAction') }
}

export type Actions
  = SecretPhraseChangeAction
  | LoadCategoriesAction
  | LoadCategoriesSuccessAction
  | LoadCategoriesFailAction
  | AddCategoryAction
  | AddCategorySuccessAction
  | AddCategoryFailAction
  | EditCategoryAction
  | EditCategorySuccessAction
  | EditCategoryFailAction
  | RemoveCategoryAction
  | RemoveCategorySuccessAction
  | RemoveCategoryFailAction;
