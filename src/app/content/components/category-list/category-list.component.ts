import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material';
import { ICategory, ICategoryItems, IItem, IItemFormResult, IRemoveCategoryPayload, IUpdateCategoryPayload, IUpdateItemPayload } from '@app/content/models';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, first, pairwise, startWith, take, takeUntil, tap } from 'rxjs/operators';
import { CategoriesQuery, CategoriesService } from '../../state/categories';
import { ItemsQuery } from '../../state/items';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryListComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject<any>();
  categories$: Observable<ICategoryItems[]>;
  itemsWithoutCategory$: Observable<IItem[]>;
  keyPressed$ = new Subject<string>();
  searchFor$: Observable<string>;
  searchForControl = new FormControl();

  @ViewChildren(MatExpansionPanel) expansionPanels: QueryList<MatExpansionPanel>;
  @ViewChildren(MatExpansionPanelHeader, { read: ElementRef }) expansionPanelsHtml: QueryList<ElementRef>;

  constructor(
    private categoriesService: CategoriesService,
    private categoriesQuery: CategoriesQuery,
    private itemsQuery: ItemsQuery,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit() {
    this.categories$ = this.categoriesQuery.selectCategoryItems();
    this.itemsWithoutCategory$ = this.itemsQuery.selectItemsWithoutCategory();

    this.searchFor$ = this.categoriesQuery.select(s => s.searchFor);

    const definedCategories$ = this.categories$.pipe(
      filter(c => !!c && c.length > 0),
      first()
    );

    combineLatest(definedCategories$, this.searchFor$).subscribe(([_c, s]) => {
      if (!!s) {
        this.expandAllPanels();
      }
    });

    this.keyPressed$.pipe(
      takeUntil(this.ngUnsubscribe),
      startWith(''),
      pairwise(),
      tap(([prev, curr]) => {
        if (curr === 'Escape' && (prev === curr)) {
          this.collapseAllPanels();
        }
      })
    ).subscribe();

    this.searchForControl.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe),
      tap(searchFor => {
        this.categoriesService.updateSearchFor(searchFor);
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    // once category panels are displayed, focus on the first
    if (this.expansionPanelsHtml.first) {
      this.focusElRef(this.expansionPanelsHtml.first);
    } else {
      this.expansionPanelsHtml.changes.pipe(
        takeUntil(this.ngUnsubscribe),
        filter(c => c.length > 0),
        take(1)
      )
        .subscribe(() => {
          setTimeout(() => {
            this.focusElRef(this.expansionPanelsHtml.first);
          });
        });
    }
  }

  addCategory(name: string) {
    this.categoriesService.addCategory(name);
  }

  removeCategory(info: IRemoveCategoryPayload) {
    this.categoriesService.removeCategory(info);
  }

  updateCategory(info: IUpdateCategoryPayload) {
    this.categoriesService.updateCategory(info);
  }

  addItem(info: IItemFormResult) {
    this.categoriesService.addItem(info);
  }

  updateItem(info: IUpdateItemPayload) {
    this.categoriesService.updateItem(info);
  }

  removeItem(i: IItem) {
    this.categoriesService.removeItem(i);
  }

  trackCategoriesBy(index: number, cat: ICategory) {
    return cat.id !== undefined ? cat.id : index;
  }

  toggleAll() {
    if (this.areAllClosed()) {
      this.expandAllPanels();
    } else {
      this.collapseAllPanels();
    }
  }

  areAllClosed() {
    if (!this.expansionPanels) { return true; }
    return !this.expansionPanels.map(x => x.expanded).some(x => x);
  }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (!this.isInputControlFocused()) {
      if (event.key === 'Backspace') {
        event.preventDefault();
      }
      this.keyPressed$.next(event.key);
      if (event.key.length === 1 || event.key === 'Escape' || event.key === 'Backspace') {
        this.categoriesService.keyPressed(event.key);
      }
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private expandAllPanels() {
    setTimeout(() => {
      if (this.expansionPanels.length) {
        this.expansionPanels.first.accordion.multi = true;
        this.expansionPanels.forEach(x => x.open());
      }
    });
  }

  private collapseAllPanels() {
    setTimeout(() => {
      if (this.expansionPanels.length) {
        this.expansionPanels.forEach(x => x.close());
        this.expansionPanels.first.accordion.multi = false;
      }
    });
  }

  private isInputControlFocused() {
    return this.document.activeElement.nodeName === 'INPUT' ||
      this.document.activeElement.nodeName === 'TEXTAREA';
  }

  private focusElRef(el: ElementRef) {
    el.nativeElement.focus();
  }
}
