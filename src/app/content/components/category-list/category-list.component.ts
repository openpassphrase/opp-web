import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatExpansionPanelHeader } from '@angular/material/expansion';
import { ExpandableInputMaterialComponent } from '@ng-expandable-input/material';
import { unparse } from 'papaparse';
import { Subject } from 'rxjs';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import {
  ICategory,
  IItem,
  IItemFormResult,
  IRemoveCategoryPayload,
  IUpdateCategoryPayload,
  IUpdateItemPayload,
} from '../../models';
import { paginate, PaginationService } from '../../services/pagination';
import { CategoriesRepository } from '../../state';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PaginationService],
})
export class CategoryListComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject<any>();

  categories$ = this.categoriesRepository.filteredCategories$.pipe(
    paginate(this.pagination)
  );

  itemsWithoutCategory$ =
    this.categoriesRepository.filteredItemsWithoutCategory$;

  searchFor$ = this.categoriesRepository.searchTerm$;

  areAllCategoriesClosed$ = this.categoriesRepository.areAllCategoriesClosed$;

  searchForControl = new UntypedFormControl();

  @ViewChild('searchExpInput')
  private searchExpInput: ExpandableInputMaterialComponent;

  @ViewChildren(MatExpansionPanelHeader, { read: ElementRef })
  private expansionPanelsHtml: QueryList<ElementRef>;

  constructor(
    private categoriesRepository: CategoriesRepository,
    public pagination: PaginationService
  ) {}

  ngOnInit() {
    this.searchForControl.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((searchFor) => {
          this.pagination.setPageIndex(0);
          this.categoriesRepository.setSearchTerm(searchFor);
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.focusOnFirstPanel();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.categoriesRepository.setExpandedCategories([]);
  }

  addCategory(name: string) {
    this.categoriesRepository.addCategory(name);
  }

  removeCategory(info: IRemoveCategoryPayload) {
    this.categoriesRepository.deleteCategory(info);
  }

  updateCategory(info: IUpdateCategoryPayload) {
    this.categoriesRepository.updateCategory(info);
  }

  addItem(info: IItemFormResult) {
    this.categoriesRepository.addItem(info);
  }

  updateItem(info: IUpdateItemPayload) {
    this.categoriesRepository.updateItem(info);
  }

  removeItem(i: IItem) {
    this.categoriesRepository.deleteItem(i);
  }

  trackByCategory(index: number, cat: ICategory) {
    return cat.id !== undefined ? cat.id : index;
  }

  trackByItem(index: number, item: IItem) {
    return item.id ?? index;
  }

  toggleAll() {
    this.categoriesRepository.toggleAllExpandedCategories();
  }

  escSearch() {
    this.clearSearch();
    this.searchExpInput.cdk.close();
  }

  clearSearch() {
    this.categoriesRepository.setSearchTerm('');
    this.searchForControl.setValue('');
    this.categoriesRepository.setExpandedCategories([]);
  }

  downloadAllData() {
    const data = this.categoriesRepository.getAllForDownload();
    const csv = unparse(data, { quotes: true });
    const blob = new Blob(['\ufeff' + csv], {
      type: 'text/plain;charset=UTF-8-BOM',
    });
    const url = URL.createObjectURL(blob);
    const el = document.createElement('a');
    el.setAttribute('href', url);
    el.setAttribute('download', 'my-passwords.csv');
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }

  private focusOnFirstPanel() {
    // once category panels are displayed, focus on the first
    if (this.expansionPanelsHtml.first) {
      this.focusElRef(this.expansionPanelsHtml.first);
    } else {
      this.expansionPanelsHtml.changes
        .pipe(
          takeUntil(this.ngUnsubscribe),
          filter((c) => c.length > 0),
          take(1)
        )
        .subscribe(() => {
          setTimeout(() => {
            this.focusElRef(this.expansionPanelsHtml.first);
          });
        });
    }
  }

  private focusElRef(el: ElementRef) {
    el.nativeElement.focus();
  }

  toggleExpandedCategory(id: number) {
    this.categoriesRepository.toggleExpandedCategory(id);
  }
}
