import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import { ICategory, IItem, IItemFormResult } from '../models';
import { environment } from '../../../environments/environment';

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
  private baseUrl: String;

  constructor(private http: AuthHttp) {
    // Note (alex_bash): This will have to be updated if other routes
    // are added. Currently, only 'content' route exists.
    this.baseUrl = `${window.location.href}`.replace('/content', '');
    if (!this.baseUrl.endsWith('/')) {
      this.baseUrl += '/';
    }  
  }

  secretPassphraseChange(secret: string) {
    if (!this.headers) {
      this.headers = new Headers();
    }
    this.headers.set('x-opp-phrase', secret);
  }

  fetchAll(): Observable<{ categories: ICategory[], items: IItem[] }> {
    return this.http.get(`${this.baseUrl}api/v1/fetchall`, { headers: this.headers })
      .map(res => res.json());
  }

  getCategories(): Observable<ICategory[]> {
    return this.http.get(`${this.baseUrl}api/v1/categories`, { headers: this.headers })
      .map(res => res.json())
      .map(x => x.categories);
  }

  addCategory(name: string): Observable<ICategory> {
    return this.http.put(`${this.baseUrl}api/v1/categories`,
      { category_names: [name] },
      { headers: this.headers }
    ).map(res => res.json())
      .map(x => x.categories[0]);
  }

  updateCategory(category: ICategory): Observable<void> {
    return this.http.post(`${this.baseUrl}api/v1/categories`,
      { categories: [category] },
      { headers: this.headers }
    ).map(res => res.json());
  }

  removeCategory(opts: { id: number, cascade: boolean }): Observable<void> {
    return this.http.delete(`${this.baseUrl}api/v1/categories`, {
      body: {
        cascade: opts.cascade,
        ids: [opts.id]
      },
      headers: this.headers
    }).map(res => res.json());
  }

  getItems(): Observable<IItem[]> {
    return this.http.get(`${this.baseUrl}api/v1/items`, { headers: this.headers })
      .map(res => res.json())
      .map(x => x.items);
  }

  addItem(info: IItemFormResult): Observable<IItem> {
    return this.http.put(`${this.baseUrl}api/v1/items`, {
      items: [info.item],
      auto_pass: info.auto_pass,
      genopts: info.genopts
    }, { headers: this.headers })
      .map(res => res.json())
      .map(x => x.items[0]);
  }

  updateItem(info: IItemFormResult): Observable<IItem> {
    return this.http.post(`${this.baseUrl}api/v1/items`, {
      items: [info.item],
      auto_pass: info.auto_pass,
      genopts: info.genopts
    }, { headers: this.headers })
      .map(res => res.json())
      .map(x => x.items[0]);
  }

  removeItem(id: number): Observable<void> {
    return this.http.delete(`${this.baseUrl}api/v1/items`, {
      body: { ids: [id] },
      headers: this.headers
    }).map(res => res.json());
  }
}
