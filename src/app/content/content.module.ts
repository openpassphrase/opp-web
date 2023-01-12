import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxErrorsModule } from '@ngspot/ngx-errors';
import { NgLetModule } from 'ng-let';
import { ClipboardModule } from 'ngx-clipboard';
import { environment } from '../../environments/environment';
import { ExpandableInputModule } from '../shared/expandable-input';
import { SharedModule } from '../shared/shared.module';
import {
  AddCategoryFormComponent,
  CategoryComponent,
  CategoryExpandedTrackerDirective,
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
import { CategoriesRepository } from './state';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentRoutingModule,
    SharedModule,
    ClipboardModule,
    NgxErrorsModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    NgLetModule,
    ExpandableInputModule,
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
    CategoryExpandedTrackerDirective,
  ],
  providers: [
    ScrollToService,
    {
      provide: BackendService,
      useClass: environment.mockApi ? BackendMockService : BackendService,
    },
    CategoriesRepository,
  ],
})
export class ContentModule {}
