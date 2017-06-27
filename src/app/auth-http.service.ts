import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { CacheService } from '@ngx-utils/cache';
import { CookiesService } from '@ngx-utils/cookies';

const HTTP_STATUS_CODE = {
  Unauthorized: 401
};

@Injectable()
export class AuthHttpService {
  constructor(private http: Http,
              @Inject(PLATFORM_ID) private platformId: any,
              private cache: CacheService,
              private cookies: CookiesService) { }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    /** Create Authorization header with accessToken if exist */
    options = this.createAuthorizationHeader(options);
    /** Check by URL if requested data exist in cache */
    if (isPlatformBrowser(this.platformId) && this.cache.has(url)) {
      /** If requested data exist in cache return observable data */
      return Observable.of(this.cache.get(url))
        .do(() => this.cache.clear(url));
    }
    return this.intercept(this.http.get(url, options))
      /** Set received data to cache if request performed on server side */
      .do((json) => {
        if (isPlatformServer(this.platformId)) {
          this.cache.set(url, json);
        }
      });
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    options = this.createAuthorizationHeader(options);
    return this.intercept(this.http.post(url, body, options));
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    options = this.createAuthorizationHeader(options);
    return this.intercept(this.http.put(url, body, options));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    options = this.createAuthorizationHeader(options);
    return this.intercept(this.http.delete(url, options));
  }

  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    options = this.createAuthorizationHeader(options);
    return this.intercept(this.http.patch(url, body, options));
  }

  head(url: string, options?: RequestOptionsArgs): Observable<any> {
    options = this.createAuthorizationHeader(options);
    return this.intercept(this.http.head(url, options));
  }

  options(url: string, options?: RequestOptionsArgs): Observable<any> {
    options = this.createAuthorizationHeader(options);
    return this.intercept(this.http.options(url, options));
  }

  private createAuthorizationHeader(options: RequestOptionsArgs = {}): RequestOptionsArgs {
    let accessToken = this.cookies.get('accessToken');
    if (accessToken) {
      if (!options.headers) {
        options.headers = new Headers();
      }
      options.headers.append('Authorization', accessToken);
    }
    return options;
  }

  private intercept(observable: Observable<Response>): Observable<any> {
    return observable
      .map(this.extractData)
      .catch((err) => this.handleError(err))
  }

  private extractData(res: Response): any {
    return res.json() || {};
  }

  private handleError(err): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      return Observable.empty();
    }
    switch (err.status) {
      case HTTP_STATUS_CODE.Unauthorized:
        this.cookies.remove('accessToken');
        break;
      default:
        break;
    }
    return Observable.throw(err);
  }
}