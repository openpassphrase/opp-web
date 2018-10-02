import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material';
import { ICategory, ICategoryItems, IItem, IItemFormResult, IRemoveCategoryPayload, IUpdateCategoryPayload, IUpdateItemPayload } from '@app/content/models';
import { combineLatest, Observable, Subject } from 'rxjs';
import { auditTime, debounceTime, filter, first, take, takeUntil, tap } from 'rxjs/operators';
import { CategoriesQuery, CategoriesService } from '../../state/categories';
import { ItemsQuery } from '../../state/items';
import { ExpandableInputComponent } from '../expandable-input/expandable-input.component';

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
  searchFor$: Observable<string>;
  searchForControl = new FormControl();

  @ViewChildren(MatExpansionPanel) expansionPanels: QueryList<MatExpansionPanel>;
  @ViewChildren(MatExpansionPanelHeader, { read: ElementRef }) expansionPanelsHtml: QueryList<ElementRef>;

  @ViewChild('expandableSearch') expandableSearch: ExpandableInputComponent;

  constructor(
    private categoriesService: CategoriesService,
    private categoriesQuery: CategoriesQuery,
    private itemsQuery: ItemsQuery,
  ) { }

  ngOnInit() {
    this.categories$ = this.categoriesQuery.selectVisibleCategoryItems();
    this.itemsWithoutCategory$ = this.itemsQuery.selectItemsWithoutCategory();

    this.searchFor$ = this.categoriesQuery.select(s => s.ui.searchFor);

    const definedCategories$ = this.categories$.pipe(
      filter(c => !!c && c.length > 0),
      first()
    );

    combineLatest(definedCategories$, this.searchFor$).pipe(
      auditTime(0)
    )
      .subscribe(([_c, s]) => {
        if (!!s) {
          for (let i = 0; i < _c.length; i++) {
            const c = _c[i];
            if (c.isHidden) {
              this.collapsePanelAtIx(i);
            } else {
              this.expandPanelAtIx(i);
            }
          }
        } else {
          this.collapseAllPanels();
        }
      });

    this.searchForControl.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe),
      debounceTime(300),
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

  @HostListener('document:keydown.escape')
  onEsc() {
    this.collapseAllPanels();
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

  clearSearch() {
    this.categoriesService.updateSearchFor('');
    this.searchForControl.setValue('');
    this.collapseAllPanels();
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
        // this.expansionPanels.first.accordion.multi = false;
      }
    });
  }

  private collapsePanelAtIx(ix: number) {
    setTimeout(() => {
      const panel = this.expansionPanels.find((_, i) => ix === i);
      if (panel && panel.opened) { panel.close(); }
    });
  }

  private expandPanelAtIx(ix: number) {
    this.expansionPanels.first.accordion.multi = true;
    setTimeout(() => {
      const panel = this.expansionPanels.find((_, i) => ix === i);
      if (panel && panel.closed) { panel.open(); }
    });
  }

  private focusElRef(el: ElementRef) {
    el.nativeElement.focus();
  }
}
