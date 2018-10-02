import { ID } from '@datorama/akita';

export interface ICategory {
  id: ID;
  name: string;
  dirty?: string;
  isHidden?: boolean;
}

export interface IItem {
  id: ID;
  name?: string;
  url?: string;
  account?: string;
  username?: string;
  password?: string;
  blob?: string;
  category_id?: number;
  isHidden?: boolean;
}

export interface IGenopts {
  min_length?: number;
  max_length?: number;
  valid_chars?: string;
  numwords?: number;
  delimiter?: string;
}

export interface IItemFormResult {
  item: IItem;
  auto_pass: boolean;
  genopts: IGenopts;
}

export interface ICategoryItems extends ICategory {
  items: IItem[];
}

export interface IUpdateCategoryPayload extends ICategory {
  initialName: string;
}

export interface IRemoveCategoryPayload {
  category: ICategory;
  cascade: boolean;
}

export interface IUpdateItemPayload {
  newInfo: IItemFormResult;
  initialItem: IItem;
}
