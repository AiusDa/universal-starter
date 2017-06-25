import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { ServerCacheModule } from '@ngx-utils/cache/server';
import { ServerCookiesModule } from '@ngx-utils/cookies/server';

import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'app-id' }),
    ServerModule,
    ServerCacheModule.forRoot(),
    ServerCookiesModule.forRoot(),
    AppModule
  ],
  bootstrap: [AppComponent]
})
export class ServerAppModule { }
