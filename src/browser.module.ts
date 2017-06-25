import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserCacheModule } from '@ngx-utils/cache/browser';
import { BrowserCookiesModule } from '@ngx-utils/cookies/src/browser';

import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'app-id' }),
    BrowserCacheModule.forRoot(),
    BrowserCookiesModule.forRoot(),
    AppModule
  ],
  bootstrap: [AppComponent],
})
export class BrowserAppModule { }
