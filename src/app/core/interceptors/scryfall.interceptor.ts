import { HttpInterceptorFn } from '@angular/common/http';

export const scryfallInterceptor: HttpInterceptorFn = (req, next) => {
  const modified = req.clone({
    setHeaders: {
      'User-Agent': 'Tome/1.0 (MTG card search app)',
    },
  });
  return next(modified);
};
