import { Directive, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesRepository } from '../../state';

@Directive({
  selector: '[appCategoryExpandedTracker]',
  exportAs: 'categoryExpandedTracker',
  standalone: true,
})
export class CategoryExpandedTrackerDirective implements OnInit {
  @Input('appCategoryExpandedTracker') categoryId: number;

  isExpanded$: Observable<boolean>;

  constructor(private categoriesRepository: CategoriesRepository) {}

  ngOnInit() {
    this.isExpanded$ = this.categoriesRepository.isCategoryExpanded$(
      this.categoryId
    );
  }
}
