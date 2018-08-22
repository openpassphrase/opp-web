import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { ICategory, IItem, IItemFormResult } from '@app/content/models';
import { IBackendService } from '@app/content/services';
import { ID } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class BackendMockService implements IBackendService {
  _data = {
    'items': [
      // tslint:disable:max-line-length
      { 'username': 'username1', 'account': 'account1', 'category_id': 1, 'name': 'Item1', 'url': 'http://example.com', 'blob': 'blob2', 'password': 'passwdfasdlord1', 'id': 1 },
      { 'username': '', 'account': '', 'category_id': 1, 'name': 'Item2', 'url': '', 'blob': '', 'password': 'facelift kitty amply', 'id': 2 },
      { 'username': 'newuser', 'account': 'my aco', 'category_id': 2, 'name': 'Bank of America', 'url': 'http://bofa.com', 'blob': 'secret q/a', 'password': 'Carlene memorizer drop-in broodmare', 'id': 3 },
      { 'username': '', 'account': '', 'category_id': 3, 'name': 'New Item', 'url': 'http://example.com', 'blob': '', 'password': 'gruesome antler', 'id': 4 },
      { 'username': 'alex', 'account': '', 'category_id': 4, 'name': 'My Site', 'url': 'http://example.com', 'blob': '', 'password': 'superhero inversion clunky', 'id': 5 },
      { 'username': '', 'account': '', 'category_id': 5, 'name': 'Ffgf', 'url': '', 'blob': '', 'password': 'apricot Milicent hooey', 'id': 6 }
    ],
    'result': 'success',
    'categories': [
      { 'id': 1, 'name': 'Demo group 1' },
      { 'id': 2, 'name': 'Finance' },
      { 'id': 3, 'name': 'Travel' },
      { 'id': 4, 'name': 'Hello World' },
      { 'id': 5, 'name': 'yabbalabbadingdong' },
      { 'id': 6, 'name': 'Unicode - \u043f\u0440\u0438\u0432\u0435\u0442' }
    ]
  } as { items: IItem[], result: string, categories: ICategory[] };
  secret: string | undefined;

  fetchAll() {
    return of(this._data)
      .pipe(share());
  }

  getCategories() {
    return of(this._data)
      .pipe(
        map(x => x.categories),
        share()
      );
  }

  addCategory(name: string): Observable<ICategory> {
    let maxId = Math.max(...this._data.categories.map(x => (<number>x.id)));
    const newCategory = { id: ++maxId, name };
    this._data.categories.push(newCategory);
    return of(newCategory);
  }

  updateCategory(category: ICategory) {
    const toUpdate = this._data.categories.find(x => x.id === category.id);
    if (!toUpdate) { throw new Error(`Category with id: ${category.id} is not found`); }
    toUpdate.name = category.name;
    return of(true);
  }

  removeCategory(opts: { id: number, cascade: boolean }) {
    const toDeleteIx = this._data.categories.findIndex(x => x.id === opts.id);
    this._data.categories.splice(toDeleteIx, 1);
    const items = this._data.items.filter(x => x.category_id === opts.id);
    items.forEach(x => {
      const ix = this._data.items.findIndex(z => x.id === z.id);
      if (opts.cascade) {
        this._data.items.splice(ix, 1);
      } else {
        this._data.items[ix].category_id = undefined;
      }
    });
    return of(true);
  }

  getItems() {
    return of(this._data)
      .pipe(
        map(x => x.items),
        share()
      );
  }

  addItem(info: IItemFormResult) {
    let maxId = Math.max(...this._data.items.map(x => <number>x.id));
    const item = { ...info.item, id: ++maxId as ID };
    this._data.items.push(item);
    return of(item);
  }

  updateItem(info: IItemFormResult) {
    let item = this._data.items.find(x => x.id === info.item.id);
    if (!item) { throw new Error(`item with id ${info.item.id} not found`); }
    item = Object.assign(item, info.item);
    return of(item);
  }

  removeItem(id: number) {
    const ix = this._data.items.findIndex(x => x.id === id);
    this._data.items.splice(ix, 1);
    return of(true);
  }

  secretPassphraseChange(secret: string | undefined) {
    this.secret = secret;
  }
}
