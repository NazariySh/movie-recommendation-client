import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DEFAULT_LANGUAGE,
  detectLangFromPathname,
  isSupportedLanguage,
  prefixPathWithLang,
} from '../locale/locale.constants';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly _lang$ = new BehaviorSubject<string>(this.getInitialLang());
  public readonly lang$ = this._lang$.asObservable();

  public constructor(private readonly translate: TranslateService) {}

  public async init(): Promise<void> {
    this.translate.addLangs(environment.supportedLanguages);
    await firstValueFrom(this.translate.use(this._lang$.value));
  }

  public setLanguage(lang: string): void {
    if (!isSupportedLanguage(lang)) return;
    if (lang === this._lang$.value) return;

    const { rest } = detectLangFromPathname(window.location.pathname);
    const target = prefixPathWithLang(rest, lang) + window.location.search + window.location.hash;
    window.location.assign(target);
  }

  public get current(): string {
    return this._lang$.value;
  }

  public syncFromUrl(): void {
    const { lang } = detectLangFromPathname(window.location.pathname);
    if (lang !== this._lang$.value) {
      this._lang$.next(lang);
      this.translate.use(lang).subscribe();
    }
  }

  private getInitialLang(): string {
    if (typeof window === 'undefined') {
      return DEFAULT_LANGUAGE;
    }
    return detectLangFromPathname(window.location.pathname).lang;
  }
}
