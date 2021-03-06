import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, tap } from 'rxjs/operators';
import { AuthStateService } from '../../../core/auth/auth-state.service';
import {
  IItem,
  IItemFormResult,
  IRemoveCategoryPayload,
  IUpdateCategoryPayload,
  IUpdateItemPayload,
} from '../../models';
import { BackendService } from '../../services/backend.service';
import { ItemsStore } from '../items';
import { CategoriesStore } from './categories.store';

@Injectable()
export class CategoriesService {
  constructor(
    private categoriesStore: CategoriesStore,
    private itemsStore: ItemsStore,
    private api: BackendService,
    private authStateService: AuthStateService,
    private snackbar: MatSnackBar
  ) {
    // clear state when logout
    authStateService.isAuthenticated$
      .pipe(
        filter((isAuthenticated) => !isAuthenticated),
        tap(() => {
          this.itemsStore.remove();
          this.categoriesStore.remove();
          this.categoriesStore.updateUi({ searchFor: '' });
        })
      )
      .subscribe();
  }

  fetchAll() {
    this.authStateService.setIsPathPhraseCorrect(false);

    this.api.fetchAll().subscribe(
      (res) => {
        this.categoriesStore.add(res.categories);
        this.itemsStore.add(res.items);
        this.authStateService.setIsPathPhraseCorrect(true);
      },
      () => {
        this.categoriesStore.remove();
        this.authStateService.setIsPathPhraseCorrect(false);
        this.itemsStore.remove();
        this.snackbar.open('Incorrect passphrase', undefined, {
          duration: 2000,
        });
      }
    );
  }

  addCategory(name: string) {
    const categoryId = this.categoriesStore.optimisticAdd(name);

    this.api.addCategory(name).subscribe(
      (res) => this.categoriesStore.update(categoryId, { id: res.id }),
      (err) => {
        console.error(err);
        this.categoriesStore.remove(categoryId);
      }
    );
  }

  removeCategory(info: IRemoveCategoryPayload) {
    // TODO: optimistic update with rollback isn't implemented
    this.api
      .removeCategory({ id: info.category.id, cascade: info.cascade })
      .subscribe(
        () => {
          this.categoriesStore.remove(info.category.id);
          if (info.cascade) {
            this.itemsStore.removeForCategory(info.category.id);
          } else {
            this.itemsStore.setCategoryUndefined(info.category.id);
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  updateCategory(info: IUpdateCategoryPayload) {
    this.categoriesStore.update(info.id, { name: info.name });

    this.api.updateCategory(info).subscribe(
      () => {},
      (err) => {
        console.error(err);
        this.categoriesStore.update(info.id, { name: info.initialName });
      }
    );
  }

  addItem(info: IItemFormResult) {
    const itemId = this.itemsStore.optimisticAdd(info.item);

    this.api.addItem(info).subscribe(
      (res) => {
        this.itemsStore.update(itemId, res);
      },
      (err) => {
        console.error(err);
        this.itemsStore.remove(itemId);
      }
    );
  }

  updateItem(info: IUpdateItemPayload) {
    this.itemsStore.update(info.newInfo.item.id, info.newInfo.item);

    this.api.updateItem(info.newInfo).subscribe(
      (res) => {
        this.itemsStore.update(info.newInfo.item.id, {
          password: res.password,
        });
      },
      (err) => {
        console.error(err);
        this.itemsStore.update(info.newInfo.item.id, info.initialItem);
      }
    );
  }

  removeItem(i: IItem) {
    this.itemsStore.remove(i.id);

    this.api.removeItem(i.id).subscribe(
      () => {},
      (err) => {
        console.error(err);
        this.itemsStore.add(i);
      }
    );
  }

  secretPhraseChange(secret: string | undefined) {
    this.categoriesStore.remove();
    this.itemsStore.remove();

    this.authStateService.secretPassphraseChange(secret);
    if (secret !== undefined) {
      this.fetchAll();
    }
  }

  logout() {
    this.secretPhraseChange(undefined);
  }

  setLoading(isLoading: boolean) {
    this.categoriesStore.setLoading(isLoading);
  }

  updateSearchFor(searchFor: string) {
    if (searchFor.length > 2) {
      this.categoriesStore.updateUi({ searchFor });
    } else if (this.categoriesStore._value().ui.searchFor.length > 2) {
      this.categoriesStore.updateUi({ searchFor: '' });
    }
  }
}
