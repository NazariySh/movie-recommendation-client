import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

const STORAGE_KEY = 'app_language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly _lang$ = new BehaviorSubject<string>(this.getInitialLang());
  readonly lang$ = this._lang$.asObservable();

  constructor(private readonly translate: TranslateService) {}

  public async init(): Promise<void> {
    const lang = this._lang$.value;
    this.translate.addLangs(environment.supportedLanguages);
    await firstValueFrom(this.translate.use(lang));
  }

  public setLanguage(lang: string): void {
    if (!environment.supportedLanguages.includes(lang)) return;
    if (lang === this._lang$.value) return;

    this.translate.use(lang).subscribe({
      next: () => {
        localStorage.setItem(STORAGE_KEY, lang);
        this._lang$.next(lang);
      },
    });
  }

  public get current(): string {
    return this._lang$.value;
  }

  private getInitialLang(): string {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && environment.supportedLanguages.includes(stored)) return stored;
    return environment.defaultLanguage;
  }
}
