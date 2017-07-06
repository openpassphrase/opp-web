import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/scan';

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
  searchFor$: Observable<string>;

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

    this.searchFor$ = this.keyPressed$
      .scan((acc, curr) => {
        if (curr === 'Escape') { return ''; }
        if (curr === 'Backspace') { return acc.slice(0, acc.length - 1); }
        return curr.length > 1 ? acc : acc + curr;
      }, '');

    this.searchFor$
      .takeUntil(this.ngUnsubscribe)
      .withLatestFrom(this.categories$)
      .filter(x => x[1].length > 0 !== undefined)
      .switchMap(([s, c]) => {
        const ixs = c.reduce<number[]>((a, b, bIx) => {
          return b.name.indexOf(s) === 0
            ? [...a, bIx] : a
        }, [])
        return Observable.of(ixs);
      })
      .filter(ixs => ixs.length === 1)
      .map(ixs => ixs[0])
      .subscribe((ix) => {
        const panel = this.expansionPanels.find((item, panelIx) => panelIx === ix);
        if (panel) {
          panel.open();
        }
      });
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
      if (event.key === 'Backspace') {
        event.preventDefault();
      }
      this.keyPressed$.next(event.key);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
