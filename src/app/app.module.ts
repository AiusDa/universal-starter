import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';

import { AppComponent } from './app.component';
import { AuthHttpService } from './auth-http.service';

@NgModule({
  imports: [
    HttpModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AuthHttpService
  ]
})
export class AppModule { }
