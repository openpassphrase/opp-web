import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxMessagesModule } from 'ngx-messages';

import { reducer } from './store/reducers';
import { CategoryEffects } from './store/effects/categories';
import { ItemEffects } from './store/effects/items';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { BackendService } from './services/backend.service';
import { AddCategoryFormComponent } from './components/add-category-form/add-category-form.component';
import { CategoryComponent, DeleteCategoryDialogComponent } from './components/category/category.component';
import { ItemComponent, DeleteItemDialogComponent } from './components/item/item.component';
import { ItemFormComponent } from './components/item-form/item-form.component';

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
    ContentRoutingModule,
    ClipboardModule,
    NgxMessagesModule,
    StoreModule.provideStore(reducer),
    EffectsModule.run(CategoryEffects),
    EffectsModule.run(ItemEffects),
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
