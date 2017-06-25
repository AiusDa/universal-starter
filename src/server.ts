import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as express from 'express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@ngx-utils/express-engine';

//noinspection BadExpressionStatementJS
import { ServerAppModuleNgFactory } from './ngfactory/server.module.ngfactory';
import { environment } from './environments/environment';

const app = express();

enableProdMode();

app.use(compression());
app.use(cookieParser('My private token'));

app.engine('html', ngExpressEngine({
  aot: true,
  bootstrap: ServerAppModuleNgFactory
}));

app.set('view engine', 'html');
app.set('views', 'dist/client');

app.use(express.static('dist/client', {index: false, maxAge: '1d'}));
app.use('/assets', express.static('dist/client/assets', {index: false}));

app.get('*', (req, res) => {
  const action = `GET: ${req.originalUrl}`;
  //noinspection TsLint
  console.time(action);
  res.render('../client/index', {cache: true, req, res});
  //noinspection TsLint
  console.timeEnd(action);
});

app.listen(environment.port, () => {
  if (environment.production) {
    console.log(`Listening at http://${environment.host}:${environment.port}`);
  }
});
