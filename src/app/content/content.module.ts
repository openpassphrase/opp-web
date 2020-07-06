import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { enableAkitaProdMode } from '@datorama/akita';
import { ExpandableInputMaterialModule } from '@ng-expandable-input/material';
import { NgxErrorsModule } from '@ngspot/ngx-errors';
import { ClipboardModule } from 'ngx-clipboard';
import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';
import {
  AddCategoryFormComponent,
  CategoryComponent,
  CategoryListComponent,
  DeleteCategoryDialogComponent,
  DeleteItemDialogComponent,
  ItemComponent,
  ItemFormComponent,
  SecretPhraseInputComponent,
} from './components';
import { ShowHidePasswordComponent } from './components/show-hide-password/show-hide-password.component';
import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { PhraseComponent } from './route-components/phrase/phrase.component';
import { SecretsComponent } from './route-components/secrets/secrets.component';
import { BackendMockService } from './services/backend.mock.service';
import { BackendService } from './services/backend.service';
import { CapitalizePipe } from './services/capitalizePipe';
import { HighlightPipe } from './services/highlightPipe';
import { ScrollToService } from './services/scrollTo';
import {
  CategoriesQuery,
  CategoriesService,
  CategoriesStore,
} from './state/categories';
import { ItemsQuery, ItemsStore } from './state/items';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentRoutingModule,
    SharedModule,
    ClipboardModule,
    NgxErrorsModule,
    ExpandableInputMaterialModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    MatTooltipModule,
    MatCheckboxModule,
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
    HighlightPipe,
    CapitalizePipe,
    ShowHidePasswordComponent,
  ],
  providers: [
    ScrollToService,
    CategoriesService,
    CategoriesStore,
    CategoriesQuery,
    ItemsStore,
    ItemsQuery,
    {
      provide: BackendService,
      useClass: environment.mockApi ? BackendMockService : BackendService,
    },
  ],
  // entryComponents: [DeleteCategoryDialogComponent, DeleteItemDialogComponent],
})
export class ContentModule {
  constructor() {
    if (environment.name !== 'dev') {
      enableAkitaProdMode();
    }
  }
}
