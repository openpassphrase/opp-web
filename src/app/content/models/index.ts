export interface ICategory {
  id: number;
  name: string;
}

export interface IItem {
  id: number;
  name?: string;
  url?: string;
  account?: string;
  username?: string;
  password?: string;
  blob?: string;
  category_id?: number;
}

export interface IGenopts {
  valid_chars?: string;
  numChars?: number;
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
