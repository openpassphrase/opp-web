import { NgModule } from '@angular/core';
import {
  AddCategoryFormComponent,
  CategoryComponent,
  CategoryListComponent,
  DeleteCategoryDialogComponent,
  DeleteItemDialogComponent,
  ItemComponent,
  ItemFormComponent,
  SecretPhraseInputComponent,
} from '@app/content/components';
import { ContentRoutingModule } from '@app/content/content-routing.module';
import { ContentComponent } from '@app/content/content.component';
import { ScrollToService } from '@app/content/services';
import { SharedModule } from '@app/shared/shared.module';
import { ExpandableInputMaterialModule } from '@ng-expandable-input/material';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxMessagesModule } from 'ngx-messages';

import { PhraseComponent } from './route-components/phrase/phrase.component';
import { SecretsComponent } from './route-components/secrets/secrets.component';

@NgModule({
  imports: [
    ContentRoutingModule,
    SharedModule,
    ClipboardModule,
    NgxMessagesModule,
    ExpandableInputMaterialModule
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
    SecretPhraseInputComponent,
    PhraseComponent,
    SecretsComponent
  ],
  providers: [
    ScrollToService
  ],
  entryComponents: [
    DeleteCategoryDialogComponent,
    ItemFormComponent,
    DeleteItemDialogComponent
  ],
  bootstrap: [ContentComponent]
})
export class ContentModule { }
