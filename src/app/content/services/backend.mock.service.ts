import { Injectable } from '@angular/core';
import { asyncScheduler, BehaviorSubject, Observable, scheduled } from 'rxjs';
import { ICategory, IItem, IItemFormResult } from '../models';
import { IBackendService } from './backend.service';

const initialItems: IItem[] = [
  // tslint:disable:max-line-length
  {
    username: 'username1',
    account: 'account1',
    category_id: 1,
    name: 'Item1',
    url: 'http://example.com',
    blob: 'blob2',
    password: 'passwdfasdlord1',
    id: 1,
  },
  {
    username: '',
    account: '',
    category_id: 1,
    name: 'Item2',
    url: '',
    blob: '',
    password: 'facelift kitty amply',
    id: 2,
  },
  {
    username: 'newuser',
    account: 'my aco',
    category_id: 2,
    name: 'Bank of America',
    url: 'http://bofa.com',
    blob: 'secret q/a',
    password: 'Carlene memorizer drop-in broodmare',
    id: 3,
  },
  {
    username: '',
    account: '',
    category_id: 3,
    name: 'New Item',
    url: 'http://example.com',
    blob: '',
    password: 'gruesome antler',
    id: 4,
  },
  {
    username: 'alex',
    account: '',
    category_id: 4,
    name: 'My Site',
    url: 'http://example.com',
    blob: '',
    password: 'superhero inversion clunky',
    id: 5,
  },
  {
    username: '',
    account: '',
    category_id: 5,
    name: 'Ffgf',
    url: '',
    blob: '',
    password: 'apricot Milicent hooey',
    id: 6,
  },
];
const initialCategories: ICategory[] = [
  { id: 1, name: 'Demo group 1' },
  { id: 2, name: 'Finance' },
  { id: 3, name: 'Travel' },
  { id: 4, name: 'Hello World' },
  { id: 5, name: 'yabbalabbadingdong' },
  { id: 6, name: 'Unicode - \u043f\u0440\u0438\u0432\u0435\u0442' },
];

@Injectable()
export class BackendMockService implements IBackendService {
  _categories = new BehaviorSubject<ICategory[]>(initialCategories);
  _items = new BehaviorSubject<IItem[]>(initialItems);
  secret: string | undefined;

  fetchAll() {
    return scheduled(
      [
        {
          categories: this._categories.getValue(),
          items: this._items.getValue(),
          result: 'success',
        },
      ],
      asyncScheduler
    );
  }

  getCategories() {
    return scheduled([this._categories.getValue()], asyncScheduler);
  }

  addCategory(name: string): Observable<ICategory> {
    const categories = this._categories.getValue();
    let maxId = Math.max(...categories.map((x) => x.id));
    const newCategory = { id: ++maxId, name };
    this._categories.next([...categories, newCategory]);
    return scheduled([newCategory], asyncScheduler);
  }

  updateCategory(category: ICategory) {
    const categories = this._categories.getValue().map((x) => {
      return x.id === category.id ? { ...x, name: category.name } : x;
    });
    this._categories.next(categories);
    return scheduled([true], asyncScheduler);
  }

  removeCategory(opts: { id: number; cascade: boolean }) {
    const newCategories = this._categories
      .getValue()
      .filter((x) => x.id === opts.id);

    const currentItems = this._items.getValue();
    const newItems = opts.cascade
      ? currentItems.filter((x) => x.category_id === opts.id)
      : currentItems.map((x) =>
          x.category_id === opts.id ? { ...x, category_id: undefined } : x
        );

    this._categories.next(newCategories);
    this._items.next(newItems);

    return scheduled([true], asyncScheduler);
  }

  getItems() {
    return scheduled([this._items], asyncScheduler);
  }

  addItem(info: IItemFormResult) {
    const items = this._items.getValue();
    let maxId = Math.max(...items.map((x) => x.id));
    const item = { ...info.item, id: ++maxId };
    this._items.next([...items, item]);
    return scheduled([item], asyncScheduler);
  }

  updateItem(info: IItemFormResult) {
    const items = this._items.getValue();
    const newItems = items.map((x) => {
      return x.id === info.item.id ? { ...x, ...info.item } : x;
    });
    this._items.next(items);
    const item = newItems.find((x) => x.id === info.item.id);

    return scheduled([item], asyncScheduler);
  }

  removeItem(id: number) {
    const items = this._items.getValue().filter((x) => x.id === id);
    this._items.next(items);
    return scheduled([true], asyncScheduler);
  }

  secretPassphraseChange(secret: string | undefined) {
    this.secret = secret;
  }
}
