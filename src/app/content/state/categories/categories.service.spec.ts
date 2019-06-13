import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategoryItems, IItem } from '@app/content/models';
import { BackendMockService, BackendService } from '@app/content/services';
import { CategoriesQuery } from './categories.query';
import { CategoriesService } from './categories.service';
import { CategoriesStore } from './categories.store';

class MatSnackBarMock { }

describe('Categories Store', () => {
  let service: CategoriesService;
  let query: CategoriesQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoriesService,
        CategoriesStore,
        CategoriesQuery,
        { provide: BackendService, useClass: BackendMockService },
        { provide: MatSnackBar, useClass: MatSnackBarMock }
      ]
    });

    service = TestBed.get<CategoriesService>(CategoriesService);
    query = TestBed.get<CategoriesQuery>(CategoriesQuery);
  });

  it('should add two categories', () => {
    let categories: ICategoryItems[] = [];
    query.selectVisibleCategoryItems().subscribe(c => categories = c);

    service.addCategory('one');
    expect(categories.length).toBe(1);
    expect(categories[0].id).not.toBe(-1);

    service.addCategory('two');
    expect(categories.length).toBe(2);
    expect(categories[0].id).not.toBe(-1);
  });

  it('should add two items', () => {
    let items: IItem[] = undefined as any;
    service.addCategory('one');

    query.selectVisibleCategoryItems().subscribe(cat => {
      const cat7 = cat.find(x => x.id === 7);
      if (!cat7) { throw new Error('Category id 7 not found'); }
      items = cat7.items;
    });

    expect(items.length).toBe(0);

    service.addItem({ item: { id: -1, name: 'one', category_id: 7 }, auto_pass: false, genopts: {} });
    expect(items.length).toBe(1);
    expect(items[0].id).not.toBe(-1);

    service.addItem({ item: { id: -1, name: 'two', category_id: 7 }, auto_pass: false, genopts: {} });
    expect(items.length).toBe(2);
    expect(items[0].id).not.toBe(-1);
  });
});
