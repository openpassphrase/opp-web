import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { ContentModule } from './content/content.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';

import { reducer } from './reducers';
import { CategoryEffects } from './effects/categories';
import { ItemEffects } from './effects/items';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule.forRoot(),
    ContentModule,
    ReactiveFormsModule,
    StoreModule.provideStore(reducer),
    EffectsModule.run(CategoryEffects),
    EffectsModule.run(ItemEffects),
    SharedModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
