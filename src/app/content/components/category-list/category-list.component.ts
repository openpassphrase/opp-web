import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/distinctUntilChanged';

import {
  Component, OnInit, OnDestroy, HostListener, Inject, ViewChildren,
  QueryList, ElementRef, Renderer, AfterViewInit
} from '@angular/core';
import { MdExpansionPanel, MdExpansionPanelHeader } from '@angular/material';
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
import { ScrollToService } from '../../services/scrollTo';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject<any>();
  categories$: Observable<ICategoryItems[]>;
  isCorrectPhrase$: Observable<boolean>;
  itemsWithoutCategory$: Observable<IItem[]>;
  keyPressed$ = new Subject<string>();
  searchFor$: Observable<string>;

  @ViewChildren(MdExpansionPanel) expansionPanels: QueryList<MdExpansionPanel>;
  @ViewChildren(MdExpansionPanelHeader, { read: ElementRef }) expansionPanelsHtml: QueryList<ElementRef>;

  constructor(
    public store: Store<fromRoot.State>,
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer,
    private scroll: ScrollToService
  ) { }

  ngOnInit() {
    this.categories$ = this.store.let(fromRoot.getCategoryItems);
    this.isCorrectPhrase$ = this.store.let(fromRoot.getIsCorrectPhrase);
    this.itemsWithoutCategory$ = this.store.let(fromRoot.getItemsWithoutCategory);

    this.searchFor$ = this.keyPressed$
      .scan((acc: string, curr: string) => {
        if (curr === 'Escape') {
          if (acc === '') {
            const panel = this.expansionPanels.find(x => x.expanded);
            if (panel) { panel.close(); }
          }
          return '';
        }
        if (curr === 'Backspace') { return acc.slice(0, acc.length - 1); }
        return curr.length > 1 ? acc : acc + curr;
      }, '')
      .distinctUntilChanged();

    this.searchFor$
      .takeUntil(this.ngUnsubscribe)
      .withLatestFrom(this.categories$)
      .filter(([s, c]) => s !== '' && c.length > 0 !== undefined)
      .switchMap(([s, c]) => {
        const ixs = c.reduce<number[]>((a, b, bIx) => {
          return b.name.toLocaleLowerCase().indexOf(s.toLocaleLowerCase()) === 0
            ? [...a, bIx] : a
        }, [])
        return Observable.of(ixs);
      })
      .filter(ixs => ixs.length > 0)
      .subscribe((ixs) => {
        const panel = this.expansionPanels.find((item, panelIx) => panelIx === ixs[0]);
        const panelHtml = this.expansionPanelsHtml.find((item, panelIx) => panelIx === ixs[0]);
        if (panelHtml) {
          this.focusElRef(panelHtml);
          const el: HTMLElement = panelHtml.nativeElement;
          this.scroll.scrollTo(el.offsetTop, 400);
        }
        if (panel && ixs.length === 1) { panel.open(); }
      });
  }

  ngAfterViewInit() {
    // once category panels are displayed, focus on the first
    this.expansionPanelsHtml.changes
      .takeUntil(this.ngUnsubscribe)
      .filter(c => c.length > 0)
      .take(1)
      .subscribe(() => {
        setTimeout(() => {
          this.focusElRef(this.expansionPanelsHtml.first);
        });
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

  toggleAll() {
    if (this.areAllClosed()) {
      this.expansionPanels.first.accordion.multi = true;
      this.expansionPanels.forEach(x => x.open());
    } else {
      this.expansionPanels.forEach(x => x.close());
      this.expansionPanels.first.accordion.multi = false;
    }
  }

  areAllClosed() {
    return !this.expansionPanels.map(x => x.expanded).some(x => x);
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

  private focusElRef(el: ElementRef) {
    this.renderer.invokeElementMethod(el.nativeElement, 'focus');
  }
}
