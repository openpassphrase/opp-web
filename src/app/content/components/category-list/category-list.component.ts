import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../store/reducers';
import * as category from '../../store/actions/categories';
import * as item from '../../store/actions/items';

import {
  ICategory, IItem, IItemFormResult, ICategoryItems, IUpdateCategoryPayload,
  IRemoveCategoryPayload, IUpdateItemPayload
} from '../../models';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories$: Observable<ICategoryItems[]>;
  itemsWithoutCategory$: Observable<IItem[]>;
  expanded$ = new BehaviorSubject<number[]>([]);
  private _expanded: number[] = [];

  constructor(
    public store: Store<fromRoot.State>,
  ) { }

  ngOnInit() {
    this.categories$ = this.store.let(fromRoot.getCategoryItems);
    this.itemsWithoutCategory$ = this.store.let(fromRoot.getItemsWithoutCategory);
  }

  addCategory(name: string) {
    this.store.dispatch(new category.AddCategoryAction(name) as any);
  }

  removeCategory(info: IRemoveCategoryPayload) {
    if (info.cascade) {
      this.store.dispatch(new item.RemoveItemsFromCategory(info.category.id) as any);
    } else {
      this.store.dispatch(new item.SetItemsCategoryByCategoryId({
        fromCategoryId: info.category.id,
        toCategoryId: undefined
      }) as any);
    }
    this.store.dispatch(new category.RemoveCategoryAction(info) as any);
    this.toggleCategoryExpanded(info.category.id);
  }

  updateCategory(info: IUpdateCategoryPayload) {
    this.store.dispatch(new category.EditCategoryAction(info) as any);
  }

  addItem(info: IItemFormResult) {
    this.store.dispatch(new item.AddItemAction(info) as any);
  }

  updateItem(info: IUpdateItemPayload) {
    this.store.dispatch(new item.UpdateItemAction(info) as any);
  }

  removeItem(i: IItem) {
    this.store.dispatch(new item.RemoveItemAction(i) as any);
  }

  toggleCategoryExpanded(id: number) {
    this._expanded = this._expanded.indexOf(id) > -1
      ? this._expanded.filter(x => x !== id)
      : [...this._expanded, id];
    this.expanded$.next(this._expanded);
  }
}
