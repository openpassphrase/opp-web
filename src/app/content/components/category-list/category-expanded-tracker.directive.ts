import { Directive, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesRepository } from '../../state';

@Directive({
  selector: '[appCategoryExpandedTracker]',
  exportAs: 'categoryExpandedTracker',
  standalone: true,
})
export class CategoryExpandedTrackerDirective implements OnInit {
  private categoriesRepository = inject(CategoriesRepository);

  @Input('appCategoryExpandedTracker') categoryId: number;

  isExpanded$: Observable<boolean>;

  ngOnInit() {
    this.isExpanded$ = this.categoriesRepository.isCategoryExpanded$(
      this.categoryId
    );
  }
}
