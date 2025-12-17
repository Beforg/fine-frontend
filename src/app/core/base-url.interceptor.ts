import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {

  // Se já for URL completa, não altera
  if (req.url.startsWith('http')) {
    return next(req);
  }

  // Adiciona a baseURL
  const apiReq = req.clone({
    url: `${environment.apiUrl}${req.url}`
  });

  return next(apiReq);
};
