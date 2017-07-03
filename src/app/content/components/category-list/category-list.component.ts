import 'rxjs/add/operator/withLatestFrom';

import { Component, OnInit, OnDestroy, HostListener, Inject, ViewChildren, QueryList } from '@angular/core';
import { MdExpansionPanel } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { DOCUMENT } from '@angular/platform-browser';

import * as fromRoot from '../../store/reducers';
import * as category from '../../store/actions/categories';
import * as item from '../../store/actions/items';

import {
  IItem, IItemFormResult, ICategoryItems, IUpdateCategoryPayload,
  IRemoveCategoryPayload, IUpdateItemPayload, ICategory
} from '../../models';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  categories$: Observable<ICategoryItems[]>;
  isCorrectPhrase$: Observable<boolean>;
  itemsWithoutCategory$: Observable<IItem[]>;
  keyPressed$ = new Subject<string>();

  @ViewChildren(MdExpansionPanel)
  expansionPanels: QueryList<MdExpansionPanel>;

  constructor(
    public store: Store<fromRoot.State>,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit() {
    this.categories$ = this.store.let(fromRoot.getCategoryItems);
    this.isCorrectPhrase$ = this.store.let(fromRoot.getIsCorrectPhrase);
    this.itemsWithoutCategory$ = this.store.let(fromRoot.getItemsWithoutCategory);
    this.keyPressed$
      .takeUntil(this.ngUnsubscribe)
      .withLatestFrom(this.categories$)
      .filter((o) => o[1].length > 0 !== undefined)
      .switchMap(([key, c]) => {
        const ix = c.findIndex(x => x.name.substr(0, 1).toLocaleLowerCase() === key);
        return Observable.of(ix)
      })
      .filter(ix => ix > -1)
      .subscribe((ix) => {
        const panel = this.expansionPanels.find((item, panelIx) => panelIx === ix);
        if (panel) {
          panel.expanded = true;
        }
      })
  }

  addCategory(name: string) {
    this.store.dispatch(new category.AddCategoryAction(name));
  }

  removeCategory(info: IRemoveCategoryPayload) {
    if (info.cascade) {
      this.store.dispatch(new item.RemoveItemsFromCategory(info.category.id));
    } else {
      this.store.dispatch(new item.SetItemsCategoryByCategoryId({
        fromCategoryId: info.category.id,
        toCategoryId: undefined
      }));
    }
    this.store.dispatch(new category.RemoveCategoryAction(info));
  }

  updateCategory(info: IUpdateCategoryPayload) {
    this.store.dispatch(new category.EditCategoryAction(info));
  }

  addItem(info: IItemFormResult) {
    this.store.dispatch(new item.AddItemAction(info));
  }

  updateItem(info: IUpdateItemPayload) {
    this.store.dispatch(new item.UpdateItemAction(info));
  }

  removeItem(i: IItem) {
    this.store.dispatch(new item.RemoveItemAction(i));
  }

  trackCategoriesBy(index: number, category: ICategory) {
    return category.id !== undefined ? category.id : index;
  }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (this.document.activeElement.nodeName !== 'INPUT' &&
      this.document.activeElement.nodeName !== 'TEXTAREA' &&
      !event.altKey && !event.ctrlKey) {
      this.keyPressed$.next(event.key);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
