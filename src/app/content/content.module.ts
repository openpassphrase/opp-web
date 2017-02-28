import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http, RequestOptions, BaseRequestOptions } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxMessagesModule } from 'ngx-messages';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { BackendService } from './services/backend.service';
import { AddCategoryFormComponent } from './components/add-category-form/add-category-form.component';
import { CategoryComponent, DeleteCategoryDialogComponent } from './components/category/category.component';
import { ItemComponent, DeleteItemDialogComponent } from './components/item/item.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { Auth } from '../auth/auth.module';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerName: 'x-opp-jwt',
    noTokenScheme: true,
    tokenGetter: () => {
      return sessionStorage.getItem('id_token');
    }
  }), http, options);
}

@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    ClipboardModule,
    NgxMessagesModule
  ],
  declarations: [
    ContentComponent,
    AddCategoryFormComponent,
    CategoryComponent,
    DeleteCategoryDialogComponent,
    ItemComponent,
    ItemFormComponent,
    DeleteItemDialogComponent
  ],
  providers: [
    BackendService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  entryComponents: [
    DeleteCategoryDialogComponent,
    ItemFormComponent,
    DeleteItemDialogComponent
  ]
})
export class ContentModule { }
