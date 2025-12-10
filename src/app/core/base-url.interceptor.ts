import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Se já tiver http/https, não mexe
    if (req.url.startsWith('http')) {
      return next.handle(req);
    }

    // Adiciona automaticamente a baseURL
    const apiReq = req.clone({
      url: `${environment.apiUrl}${req.url}`
    });

    return next.handle(apiReq);
  }
}
