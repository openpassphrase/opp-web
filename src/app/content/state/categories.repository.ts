import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createState, getRegistry, propsFactory, Store } from '@ngneat/elf';
import {
  addEntities,
  deleteEntities,
  deleteEntitiesByPredicate,
  entitiesPropsFactory,
  selectActiveIds,
  selectAllEntities,
  setActiveIds,
  setEntities,
  toggleActiveIds,
  updateEntities,
  updateEntitiesByPredicate,
  updateEntitiesIds,
  withActiveIds,
  withEntities,
} from '@ngneat/elf-entities';
import { combineLatest } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  shareReplay,
  startWith,
} from 'rxjs/operators';
import { AuthStateService } from '../../core/auth/auth-state.service';
import { guid } from '../../misc';
import {
  ICategory,
  ICategoryItems,
  IItem,
  IItemFormResult,
  IRemoveCategoryPayload,
  IUpdateCategoryPayload,
  IUpdateItemPayload,
} from '../models';
import { BackendService } from '../services/backend.service';

const { itemEntitiesRef, withItemEntities } = entitiesPropsFactory('item');
const { withSearchTerm, selectSearchTerm, setSearchTerm, getSearchTerm } =
  propsFactory('searchTerm', {
    initialValue: '',
  });

const { state, config } = createState(
  withEntities<ICategory>({ initialValue: [] }),
  withActiveIds([] as ICategory['id'][]),
  withItemEntities<IItem>({ initialValue: [] }),
  withSearchTerm()
);

const store = new Store({ name: 'categories', state, config });

@Injectable()
export class CategoriesRepository {
  private categories$ = store.pipe(selectAllEntities(), shareReplay(1));

  private items$ = store.pipe(
    selectAllEntities({ ref: itemEntitiesRef }),
    shareReplay(1)
  );

  searchTerm$ = store.pipe(
    selectSearchTerm(),
    filter((x) => !x || x.length > 2), // skip search terms with length less than 3
    shareReplay(1)
  );

  private searchTermWithPrev$ = this.searchTerm$.pipe(
    pairwise(),
    startWith(store.query(getSearchTerm))
  );

  private categoriesWithItems$ = store
    .combine({
      categories: this.categories$,
      items: this.items$,
    })
    .pipe(
      map((x) => {
        return x.categories.map(associateItemsWithCategory(x.items));
      })
    );

  private itemsWithoutCategory$ = this.items$.pipe(
    map((items) =>
      items.filter(
        (item) => item.category_id === undefined || item.category_id === null
      )
    )
  );

  filteredCategories$ = combineLatest([
    this.categoriesWithItems$,
    this.searchTermWithPrev$,
  ]).pipe(
    map(([categories, [prevSearchTerm, searchTerm]]) => {
      if (!searchTerm) {
        if (prevSearchTerm !== searchTerm) {
          setTimeout(() => {
            this.setExpandedCategories([]);
          }, 0);
        }
        return categories;
      }

      const matching = categories.reduce((acc, category) => {
        const categoryMatchesSearch = matchesSearchWord(searchTerm)(category);
        if (categoryMatchesSearch) {
          acc.push(category);
          return acc;
        }

        const items = category.items.filter(matchesSearchWord(searchTerm));
        if (items.length > 0) {
          acc.push({ ...category, items });
        }

        return acc;
      }, [] as ICategoryItems[]);

      if (prevSearchTerm !== searchTerm) {
        const activeIds = matching.map((category) => category.id);
        setTimeout(() => {
          this.setExpandedCategories(activeIds.length > 5 ? [] : activeIds);
        }, 0);
      }

      return matching;
    })
  );

  filteredItemsWithoutCategory$ = combineLatest([
    this.itemsWithoutCategory$,
    this.searchTerm$,
  ]).pipe(
    map(([items, searchTerm]) => {
      if (!searchTerm) {
        return items;
      }

      return items.filter((item) => {
        return matchesSearchWord(searchTerm)(item);
      });
    })
  );

  areAllCategoriesClosed$ = store.pipe(
    selectActiveIds(),
    map((ids) => ids.length === 0)
  );

  constructor(
    private api: BackendService,
    private authStateService: AuthStateService,
    private snackbar: MatSnackBar
  ) {}

  isCategoryExpanded$(categoryId: ICategory['id']) {
    return store.pipe(
      selectActiveIds(),
      map((ids) => ids.includes(categoryId)),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  secretPhraseChange(secret: string | undefined) {
    resetStores();

    this.authStateService.secretPassphraseChange(secret);
    if (secret !== undefined) {
      this.fetchAll();
    }
  }

  setCategories(categories: ICategory[]) {
    store.update(setEntities(categories));
  }

  addCategory(categoryName: string) {
    const id = this.optimisticCategoryAdd(categoryName);

    this.api.addCategory(categoryName).subscribe(
      (res) => {
        store.update(
          updateEntitiesIds(id, res.id),
          updateEntities(res.id, res)
        );
      },
      (err) => {
        console.error(err);
        store.update(deleteEntities(id));
      }
    );
  }

  updateCategory(info: IUpdateCategoryPayload) {
    store.update(updateEntities(info.id, { name: info.name }));

    this.api.updateCategory(info).subscribe(
      () => {},
      (err) => {
        console.error(err);
        store.update(updateEntities(info.id, { name: info.initialName }));
      }
    );
  }

  deleteCategory(info: IRemoveCategoryPayload) {
    this.api
      .removeCategory({ id: info.category.id, cascade: info.cascade })
      .subscribe(
        () => {
          store.update(deleteEntities(info.category.id));
          if (info.cascade) {
            store.update(
              deleteEntitiesByPredicate(
                (x) => x.category_id === info.category.id,
                { ref: itemEntitiesRef }
              )
            );
          } else {
            store.update(
              updateEntitiesByPredicate(
                (x) => x.category_id === info.category.id,
                { category_id: undefined },
                { ref: itemEntitiesRef }
              )
            );
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  toggleExpandedCategory(id: ICategory['id']) {
    store.update(toggleActiveIds(id));
  }

  toggleAllExpandedCategories() {
    const ids = store.value.activeIds.length === 0 ? store.value.ids : [];
    store.update(setActiveIds(ids));
  }

  setExpandedCategories(ids: ICategory['id'][]) {
    store.update(setActiveIds(ids));
  }

  setItems(items: IItem[]) {
    store.update(setEntities(items, { ref: itemEntitiesRef }));
  }

  addItem(info: IItemFormResult) {
    const itemId = this.optimisticItemAdd(info.item);

    this.api.addItem(info).subscribe(
      (res) => {
        store.update(
          updateEntitiesIds(itemId, res.id, { ref: itemEntitiesRef }),
          updateEntities(res.id, res, { ref: itemEntitiesRef })
        );
      },
      (err) => {
        console.error(err);
        store.update(deleteEntities(itemId, { ref: itemEntitiesRef }));
      }
    );
  }

  updateItem(info: IUpdateItemPayload) {
    store.update(
      updateEntities(info.newInfo.item.id, info.newInfo.item, {
        ref: itemEntitiesRef,
      })
    );

    this.api.updateItem(info.newInfo).subscribe(
      ({ password }) => {
        store.update(
          updateEntities(
            info.newInfo.item.id,
            { password },
            { ref: itemEntitiesRef }
          )
        );
      },
      (err) => {
        console.error(err);
        store.update(
          updateEntities(info.newInfo.item.id, info.initialItem, {
            ref: itemEntitiesRef,
          })
        );
      }
    );
  }

  deleteItem(item: IItem) {
    store.update(deleteEntities(item.id, { ref: itemEntitiesRef }));

    this.api.removeItem(item.id).subscribe(
      () => {},
      (err) => {
        console.error(err);
        store.update(addEntities(item, { ref: itemEntitiesRef }));
      }
    );
  }

  setSearchTerm(searchTerm: string) {
    store.update(setSearchTerm(searchTerm));
  }

  getAllForDownload() {
    const categories = store.getValue().entities;
    const items = store.getValue().itemEntities;

    return Object.values(items).map((item) => {
      const { name, url, account, username, password, blob, category_id } =
        item;

      const category =
        category_id !== undefined ? categories[category_id]?.name ?? '' : '';

      return {
        category,
        name,
        url,
        account,
        username,
        password,
        blob,
      };
    });
  }

  private fetchAll() {
    this.api.fetchAll().subscribe(
      (res) => {
        store.update(
          setEntities(res.categories),
          setEntities(res.items, { ref: itemEntitiesRef })
        );
        this.authStateService.setIsPathPhraseCorrect(true);
      },
      () => {
        resetStores();
        this.authStateService.setIsPathPhraseCorrect(false);
        this.snackbar.open('Incorrect passphrase', undefined, {
          duration: 2000,
        });
      }
    );
  }

  private optimisticCategoryAdd(name: string) {
    const category: ICategory = {
      id: guid() as any,
      name,
    };
    store.update(addEntities(category));
    return category.id;
  }

  private optimisticItemAdd(item: IItem) {
    item.id = guid() as any;
    store.update(addEntities(item, { ref: itemEntitiesRef }));
    return item.id;
  }
}

function associateItemsWithCategory(items: IItem[]) {
  return (category: ICategory) => {
    const toReturn: ICategoryItems = {
      ...category,
      items: items.filter((x) => x.category_id === category.id),
    };
    return toReturn;
  };
}

function matchesSearchWord(searchFor: string | undefined) {
  return (x: ICategory | IItem) => {
    const name = x.name || '';
    if (!searchFor || !name) {
      return false;
    }
    return name.toLocaleLowerCase().indexOf(searchFor.toLocaleLowerCase()) > -1;
  };
}

export function resetStores() {
  getRegistry().forEach((s) => s.reset());
}
