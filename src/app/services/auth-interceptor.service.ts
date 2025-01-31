import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // @ts-ignore
    return undefined;
  }

  /*
    constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return from(this.handleAccess(req, next));
    }

    private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
      const theEndPoint = environment.luv2shopApiUrl + '/orders'
      const securedEndpoints = [theEndPoint];

      if (securedEndpoints.some(url => req.urlWithParams.includes(url))) {
        const accessToken = this.oktaAuth.getAccessToken();

        req = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + accessToken
          }
        });
      }

      return await lastValueFrom(next.handle(req));
    }

   */
}
