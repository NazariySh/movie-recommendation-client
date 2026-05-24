import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { globalSpinner$ } from './shared/utils/wrap-with-spinner';

export type LayoutKind = 'main' | 'auth' | 'admin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly layout$: Observable<LayoutKind>;
  public readonly globalSpinner$ = globalSpinner$;

  constructor(private readonly router: Router) {
    this.layout$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.resolveLayout(e.urlAfterRedirects)),
      startWith(this.resolveLayout(this.router.url)),
    );
  }

  private resolveLayout(url: string): LayoutKind {
    if (url.startsWith('/auth')) return 'auth';
    if (url.startsWith('/admin')) return 'admin';
    return 'main';
  }
}
