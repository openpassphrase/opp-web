import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import { ICategory, IItem, IItemFormResult } from '../models';

export interface IBackendService {
  fetchAll(): Observable<{ categories: ICategory[], items: IItem[] }>;
  addCategory(name: string): Observable<ICategory>;
  updateCategory(category: ICategory): Observable<any>;
  removeCategory(opts: { id: number, cascade: boolean }): Observable<any>;
  addItem(info: IItemFormResult): Observable<IItem>;
  updateItem(info: IItemFormResult): Observable<any>;
  removeItem(id: number): Observable<any>;
}

@Injectable()
export class BackendService implements IBackendService {
  private headers: Headers;
  private categoriesEndpoint: string;
  private itemsEndpoint: string

  constructor(private http: AuthHttp, private location: Location) {
    this.categoriesEndpoint = this.location.prepareExternalUrl('api/v1/categories');
    this.itemsEndpoint = this.location.prepareExternalUrl('api/v1/items')
  }

  secretPassphraseChange(secret: string | undefined) {
    if (!this.headers) {
      this.headers = new Headers();
    }
    this.headers.set('x-opp-phrase', secret || '');
  }

  fetchAll(): Observable<{ categories: ICategory[], items: IItem[] }> {
    return this.http.get(this.location.prepareExternalUrl('api/v1/fetchall'), { headers: this.headers })
      .map(res => res.json());
  }

  getCategories(): Observable<ICategory[]> {
    return this.http.get(this.categoriesEndpoint, { headers: this.headers })
      .map(res => res.json())
      .map(x => x.categories);
  }

  addCategory(name: string): Observable<ICategory> {
    return this.http.put(this.categoriesEndpoint,
      { category_names: [name] },
      { headers: this.headers }
    ).map(res => res.json())
      .map(x => x.categories[0]);
  }

  updateCategory(category: ICategory): Observable<void> {
    return this.http.post(this.categoriesEndpoint,
      { categories: [category] },
      { headers: this.headers }
    ).map(res => res.json());
  }

  removeCategory(opts: { id: number, cascade: boolean }): Observable<void> {
    return this.http.delete(this.categoriesEndpoint, {
      body: {
        cascade: opts.cascade,
        ids: [opts.id]
      },
      headers: this.headers
    }).map(res => res.json());
  }

  getItems(): Observable<IItem[]> {
    return this.http.get(this.itemsEndpoint, { headers: this.headers })
      .map(res => res.json())
      .map(x => x.items);
  }

  addItem(info: IItemFormResult): Observable<IItem> {
    return this.http.put(this.itemsEndpoint, {
      items: [info.item],
      auto_pass: info.auto_pass,
      genopts: info.genopts
    }, { headers: this.headers })
      .map(res => res.json())
      .map(x => x.items[0]);
  }

  updateItem(info: IItemFormResult): Observable<IItem> {
    return this.http.post(this.itemsEndpoint, {
      items: [info.item],
      auto_pass: info.auto_pass,
      genopts: info.genopts
    }, { headers: this.headers })
      .map(res => res.json())
      .map(x => x.items[0]);
  }

  removeItem(id: number): Observable<void> {
    return this.http.delete(this.itemsEndpoint, {
      body: { ids: [id] },
      headers: this.headers
    }).map(res => res.json());
  }
}
