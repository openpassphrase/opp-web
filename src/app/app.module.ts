import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { Auth, AuthGuard, UnAuthGuard } from './shared/auth-services'
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
    SharedModule,
  ],
  providers: [
    Auth,
    AuthGuard,
    UnAuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
