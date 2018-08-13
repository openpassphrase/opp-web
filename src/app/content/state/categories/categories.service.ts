import { Injectable } from '@angular/core';
import { CategoriesStore } from './categories.store';
import { BackendService } from '@app/content/services/backend.service';
import { ItemsStore } from '../items';
import { MatSnackBar } from '@angular/material';
import { IRemoveCategoryPayload, IUpdateCategoryPayload, IItemFormResult, IUpdateItemPayload, IItem } from '@app/content/models';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(
    private categoriesStore: CategoriesStore,
    private itemsStore: ItemsStore,
    private api: BackendService,
    private snackbar: MatSnackBar
  ) { }

  fetchAll() {
    this.categoriesStore.setIsPathPhraseCorrect(false);

    this.api.fetchAll().subscribe(
      res => {
        this.categoriesStore.add(res.categories);
        this.itemsStore.add(res.items);
        this.categoriesStore.setIsPathPhraseCorrect(true);
      },
      () => {
        this.categoriesStore.remove();
        this.categoriesStore.setIsPathPhraseCorrect(false);
        this.itemsStore.remove();
        this.snackbar.open('Incorrect passphrase', undefined, { duration: 2000 });
      }
    );
  }

  addCategory(name: string) {
    const dirty = this.categoriesStore.optimisticAdd(name);

    this.api.addCategory(name).subscribe(
      res => this.categoriesStore.updateOptimistic(dirty, res.id),
      err => {
        console.error(err);
        this.categoriesStore.deleteOptimistic(dirty);
      }
    );
  }

  removeCategory(info: IRemoveCategoryPayload) {
    // TODO: optimistic update with rollback isn't implemented
    this.api.removeCategory({ id: info.category.id, cascade: info.cascade }).subscribe(
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
      () => { },
      (err) => {
        console.error(err);
        this.categoriesStore.update(info.id, { name: info.initialName });
      }
    );
  }

  addItem(info: IItemFormResult) {
    this.itemsStore.add(info.item);

    this.api.addItem(info).subscribe(
      res => {
        this.itemsStore.update(info.item.id, { password: res.password });
      },
      err => {
        console.error(err);
        this.itemsStore.remove(info.item.id);
      }
    );
  }

  updateItem(info: IUpdateItemPayload) {
    this.itemsStore.update(info.newInfo.item.id, info.newInfo.item);

    this.api.updateItem(info.newInfo).subscribe(
      res => {
        this.itemsStore.update(info.newInfo.item.id, { password: res.password });
      },
      err => {
        console.error(err);
        this.itemsStore.update(info.newInfo.item.id, info.initialItem);
      }
    );
  }

  removeItem(i: IItem) {
    this.itemsStore.remove(i.id);

    this.api.removeItem(i.id).subscribe(
      () => { },
      err => {
        console.error(err);
        this.itemsStore.add(i);
      }
    );
  }

  secretPhraseChange(secret: string | undefined) {
    this.categoriesStore.remove();
    this.itemsStore.remove();

    this.api.secretPassphraseChange(secret);
    if (secret !== undefined) {
      this.fetchAll();
    } else {
      this.categoriesStore.setIsPathPhraseCorrect(false);
    }
  }

  logout() {
    this.secretPhraseChange(undefined);
  }

  setLoading(isLoading: boolean) {
    this.categoriesStore.setLoading(isLoading);
  }
}
