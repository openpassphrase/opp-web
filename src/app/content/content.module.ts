import { NgModule } from '@angular/core';
import { AddCategoryFormComponent, CategoryComponent, CategoryListComponent, DeleteCategoryDialogComponent, DeleteItemDialogComponent, ItemComponent, ItemFormComponent, SecretPhraseInputComponent } from '@app/content/components';
import { ContentRoutingModule } from '@app/content/content-routing.module';
import { ContentComponent } from '@app/content/content.component';
import { ScrollToService } from '@app/content/services';
import { SharedModule } from '@app/shared/shared.module';
import { ExpandableInputModule } from 'expandable-input';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxMessagesModule } from 'ngx-messages';
import { ExpandableInputComponent, ExpIconCloseDirective } from './components/expandable-input/expandable-input.component';
import { PhraseComponent } from './route-components/phrase/phrase.component';
import { SecretsComponent } from './route-components/secrets/secrets.component';



@NgModule({
  imports: [
    ContentRoutingModule,
    SharedModule,
    ClipboardModule,
    NgxMessagesModule,
    ExpandableInputModule
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
    SecretsComponent,
    ExpandableInputComponent,
    ExpIconCloseDirective
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
