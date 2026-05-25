import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { globalSpinner$ } from './shared/utils/wrap-with-spinner';
import { LanguageService } from './core/services/language.service';
import { detectLangFromPathname } from './core/locale/locale.constants';

export type LayoutKind = 'main' | 'auth' | 'admin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly layout$: Observable<LayoutKind>;
  public readonly globalSpinner$ = globalSpinner$;

  public constructor(
    private readonly router: Router,
    private readonly languageService: LanguageService,
  ) {
    this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(() => {
      this.languageService.syncFromUrl();
    });

    this.layout$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.resolveLayout(e.urlAfterRedirects)),
      startWith(this.resolveLayout(this.router.url)),
    );
  }

  private resolveLayout(url: string): LayoutKind {
    const path = url.split('?')[0].split('#')[0];
    const { rest } = detectLangFromPathname(path);
    if (rest.startsWith('/auth')) return 'auth';
    if (rest.startsWith('/admin')) return 'admin';
    return 'main';
  }
}
