import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  declarations: []
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [
      ]
    };
  }
}
