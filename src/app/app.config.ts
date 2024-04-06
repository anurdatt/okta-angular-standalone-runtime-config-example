import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HttpBackend,
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { OktaAuthConfigService, OktaAuthModule } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { tap, take } from 'rxjs';
import { authInterceptor } from './shared/okta/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './shared/okta/auth.service';
import { ScrollService } from './shared/scroll/scroll.service';

function configInitializer(
  httpBackend: HttpBackend,
  configService: OktaAuthConfigService
): () => void {
  return () =>
    new HttpClient(httpBackend).get('api/config.json').pipe(
      tap((authConfig: any) =>
        configService.setConfig({
          oktaAuth: new OktaAuth({
            ...authConfig,
            redirectUri: `${window.location.origin}/callback`,
          }),
        })
      ),
      take(1)
    );
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(OktaAuthModule),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: configInitializer,
      deps: [HttpBackend, OktaAuthConfigService],
      multi: true,
    },
    provideAnimationsAsync(),
    AuthService,
    ScrollService,
  ],
};
