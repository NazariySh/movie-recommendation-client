import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { SpinnerModule } from './shared/components/spinner/spinner.module';
import { CoreModule } from './core/core.module';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { languageInterceptor } from './core/interceptors/language.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { retryInterceptor } from './core/interceptors/retry.interceptor';

import { LanguageService } from './core/services/language.service';
import { AuthService } from './core/services/auth.service';

function initApp(languageService: LanguageService, authService: AuthService): () => Promise<void> {
  return async (): Promise<void> => {
    await languageService.init();
    await authService.loadCurrentUser().toPromise();
  };
}

@NgModule({
  declarations: [AppComponent, NotFoundComponent, ServerErrorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    SpinnerModule,
    TranslateModule.forRoot(),
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([errorInterceptor, languageInterceptor, authInterceptor, retryInterceptor])
    ),
    ...provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [LanguageService, AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
