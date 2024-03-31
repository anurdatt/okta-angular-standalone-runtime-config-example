import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next,
  oktaAuth = inject(OKTA_AUTH)
) => {
  let request = req;
  const allowedOrigins = [environment.apiUrl, environment.blogsApiUrl];
  const accessToken = oktaAuth.getAccessToken();
  if (
    accessToken &&
    !!allowedOrigins.find((origin) => req.url.includes(origin))
  ) {
    request = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(request);
};
