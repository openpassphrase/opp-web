import { AsyncPipe, NgFor, NgIf } from '@angular/common';
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
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatTooltip } from '@angular/material/tooltip';
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ExpIconCloseDirective,
  ExpIconOpenDirective,
  ExpInputDirective,
  ExpandableInputComponent,
  animateCssProperty,
  smoothHorizontalCollapse,
} from '@ngspot/expandable-input';
import { NgLetModule } from 'ng-let';
import { unparse } from 'papaparse';
import { Subject } from 'rxjs';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { AppExpandableInputComponent } from '../../../shared/expandable-input/expandable-input.component';
import {
  ICategory,
  IItem,
  IItemFormResult,
  IRemoveCategoryPayload,
  IUpdateCategoryPayload,
  IUpdateItemPayload,
} from '../../models';
import { PaginationService, paginate } from '../../services/pagination';
import { CategoriesRepository } from '../../state';
import { AddCategoryFormComponent } from '../add-category-form/add-category-form.component';
import { CategoryComponent } from '../category/category.component';
import { ItemComponent } from '../item/item.component';
import { CategoryExpandedTrackerDirective } from './category-expanded-tracker.directive';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PaginationService],
  animations: [
    smoothHorizontalCollapse({
      durationMs: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    }),
    animateCssProperty({
      propName: 'gap',
      falseValue: '1rem',
      trueValue: '0',
      durationMs: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    }),
    animateCssProperty({
      propName: 'margin-right',
      falseValue: 'calc(1rem + 30px)',
      trueValue: '0',
      durationMs: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    }),
    animateCssProperty({
      propName: 'z-index',
      falseValue: '',
      trueValue: '10',
      durationMs: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    }),
  ],
  standalone: true,
  imports: [
    NgLetModule,
    NgIf,
    MatMiniFabButton,
    MatTooltip,
    MatIcon,
    AppExpandableInputComponent,
    ExpInputDirective,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    ExpIconOpenDirective,
    ExpIconCloseDirective,
    AddCategoryFormComponent,
    MatAccordion,
    NgFor,
    CategoryExpandedTrackerDirective,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    CategoryComponent,
    MatExpansionPanelContent,
    ItemComponent,
    MatPaginator,
    AsyncPipe,
  ],
})
export class CategoryListComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  categories$ = this.categoriesRepository.filteredCategories$.pipe(
    paginate(this.pagination)
  );

  itemsWithoutCategory$ =
    this.categoriesRepository.filteredItemsWithoutCategory$;

  searchFor$ = this.categoriesRepository.searchTerm$;

  areAllCategoriesClosed$ = this.categoriesRepository.areAllCategoriesClosed$;

  searchForControl = new UntypedFormControl();

  @ViewChild('searchExpInput')
  private searchExpInput: ExpandableInputComponent;

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
    this.searchExpInput.close();
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
