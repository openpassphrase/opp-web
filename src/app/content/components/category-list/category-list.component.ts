import {
  Component, OnInit, OnDestroy, HostListener, Inject, ViewChildren,
  QueryList, ElementRef, Renderer, AfterViewInit, ChangeDetectionStrategy
} from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material';
import { Observable, Subject, of } from 'rxjs';
import { scan, distinctUntilChanged, takeUntil, withLatestFrom, filter, switchMap, take } from 'rxjs/operators';
import { DOCUMENT } from '@angular/platform-browser';

import {
  IItem, IItemFormResult, ICategoryItems, IUpdateCategoryPayload,
  IRemoveCategoryPayload, IUpdateItemPayload, ICategory
} from '@app/content/models';
import { ScrollToService } from '@app/content/services/scrollTo';
import { CategoriesService, CategoriesQuery } from '../../state/categories';
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
  isCorrectPhrase$: Observable<boolean>;
  itemsWithoutCategory$: Observable<IItem[]>;
  keyPressed$ = new Subject<string>();
  searchFor$: Observable<string>;

  @ViewChildren(MatExpansionPanel) expansionPanels: QueryList<MatExpansionPanel>;
  @ViewChildren(MatExpansionPanelHeader, { read: ElementRef }) expansionPanelsHtml: QueryList<ElementRef>;

  constructor(
    private categoriesService: CategoriesService,
    private categoriesQuery: CategoriesQuery,
    private itemsQuery: ItemsQuery,
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer,
    private scroll: ScrollToService
  ) { }

  ngOnInit() {
    this.categories$ = this.categoriesQuery.selectCategoryItems();
    this.isCorrectPhrase$ = this.categoriesQuery.selectIsPathPhraseCorrect();
    this.itemsWithoutCategory$ = this.itemsQuery.selectItemsWithoutCategory();

    this.searchFor$ = this.keyPressed$.pipe(
      scan((acc: string, curr: string) => {
        if (curr === 'Escape') {
          if (acc === '') {
            const panel = this.expansionPanels.find(x => x.expanded);
            if (panel) { panel.close(); }
          }
          return '';
        }
        if (curr === 'Backspace') { return acc.slice(0, acc.length - 1); }
        return curr.length > 1 ? acc : acc + curr;
      }, ''),
      distinctUntilChanged()
    );

    this.searchFor$.pipe(
      takeUntil(this.ngUnsubscribe),
      withLatestFrom(this.categories$),
      filter(([s, c]) => s !== '' && c.length > 0 !== undefined),
      switchMap(([s, c]) => {
        const ixs = c.reduce<number[]>((a, b, bIx) => {
          return b.name.toLocaleLowerCase().indexOf(s.toLocaleLowerCase()) === 0
            ? [...a, bIx] : a;
        }, []);
        return of(ixs);
      }),
      filter(ixs => ixs.length > 0)
    ).subscribe((ixs) => {
      const panel = this.expansionPanels.find((_item, panelIx) => panelIx === ixs[0]);
      const panelHtml = this.expansionPanelsHtml.find((_item, panelIx) => panelIx === ixs[0]);
      if (panelHtml) {
        this.focusElRef(panelHtml);
        const el: HTMLElement = panelHtml.nativeElement;
        this.scroll.scrollTo(el.offsetTop, 400);
      }
      if (panel && ixs.length === 1) {
        panel.open();
      }
    });
  }

  ngAfterViewInit() {
    // once category panels are displayed, focus on the first
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
