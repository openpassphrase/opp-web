import { NgModule } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxMessagesModule } from 'ngx-messages';

import { ContentRoutingModule } from '@app/content/content-routing.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContentComponent } from '@app/content/content.component';
import {
  AddCategoryFormComponent,
  CategoryComponent,
  DeleteCategoryDialogComponent,
  ItemComponent,
  ItemFormComponent,
  DeleteItemDialogComponent,
  CategoryListComponent,
  SecretPhraseInputComponent
} from '@app/content/components';
import { ScrollToService } from '@app/content/services';

@NgModule({
  imports: [
    ContentRoutingModule,
    SharedModule,
    ClipboardModule,
    NgxMessagesModule,
  ],
  declarations: [
    ContentComponent,
    AddCategoryFormComponent,
    CategoryComponent,
    DeleteCategoryDialogComponent,
    ItemComponent,
    ItemFormComponent,
    DeleteItemDialogComponent,
    CategoryListComponent,
    SecretPhraseInputComponent
  ],
  providers: [
    ScrollToService
  ],
  entryComponents: [
    DeleteCategoryDialogComponent,
    ItemFormComponent,
    DeleteItemDialogComponent
  ]
})
export class ContentModule { }
