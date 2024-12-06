import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { ICategory, IItem, IItemFormResult } from '../models';

export interface IBackendService {
  fetchAll(): Observable<{ categories: ICategory[]; items: IItem[] }>;
  addCategory(name: string): Observable<ICategory>;
  updateCategory(category: ICategory): Observable<any>;
  removeCategory(opts: { id: number; cascade: boolean }): Observable<any>;
  addItem(info: IItemFormResult): Observable<IItem>;
  updateItem(info: IItemFormResult): Observable<any>;
  removeItem(id: number): Observable<any>;
}

@Injectable()
export class BackendService implements IBackendService {
  private http = inject(HttpClient);
  private location = inject(Location);

  private categoriesEndpoint: string;
  private itemsEndpoint: string;

  constructor() {
    this.categoriesEndpoint =
      this.location.prepareExternalUrl('api/v1/categories');
    this.itemsEndpoint = this.location.prepareExternalUrl('api/v1/items');
  }

  fetchAll() {
    const url = this.location.prepareExternalUrl('api/v1/fetchall');

    return this.http
      .get<{ categories: ICategory[]; items: IItem[] }>(url)
      .pipe(share());
  }

  getCategories() {
    return this.http
      .get<{ categories: ICategory[] }>(this.categoriesEndpoint)
      .pipe(
        map((x) => x.categories),
        share()
      );
  }

  addCategory(name: string): Observable<ICategory> {
    return this.http
      .put<{ categories: ICategory[] }>(this.categoriesEndpoint, {
        category_names: [name],
      })
      .pipe(map((x) => x.categories[0]));
  }

  updateCategory(category: ICategory) {
    return this.http.post(this.categoriesEndpoint, { categories: [category] });
  }

  removeCategory(opts: { id: number; cascade: boolean }) {
    return this.http.request('delete', this.categoriesEndpoint, {
      body: {
        cascade: opts.cascade,
        ids: [opts.id],
      },
    });
  }

  getItems() {
    return this.http.get<{ items: IItem[] }>(this.itemsEndpoint).pipe(
      map((x) => x.items),
      share()
    );
  }

  addItem(info: IItemFormResult) {
    return this.http
      .put<{ items: IItem[] }>(this.itemsEndpoint, {
        items: [info.item],
        auto_pass: info.auto_pass,
        genopts: info.genopts,
      })
      .pipe(map((x) => x.items[0]));
  }

  updateItem(info: IItemFormResult) {
    return this.http
      .post<{ items: IItem[] }>(this.itemsEndpoint, {
        items: [info.item],
        auto_pass: info.auto_pass,
        genopts: info.genopts,
      })
      .pipe(map((x) => x.items[0]));
  }

  removeItem(id: number) {
    return this.http.request('delete', this.itemsEndpoint, {
      body: { ids: [id] },
    });
  }
}
