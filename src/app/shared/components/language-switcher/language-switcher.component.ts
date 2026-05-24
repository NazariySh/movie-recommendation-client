import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../../core/services/language.service';

interface LanguageOption {
  code: string;
  labelKey: string;
  flag: string;
}

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TranslateModule, MatMenuModule, MatIconModule],
})
export class LanguageSwitcherComponent {
  @Input() public variant: 'icon' | 'inline' = 'icon';

  public readonly languages: LanguageOption[] = [
    { code: 'uk', labelKey: 'LANGUAGE.UK', flag: '🇺🇦' },
    { code: 'en', labelKey: 'LANGUAGE.EN', flag: '🇬🇧' },
  ];

  private readonly languageService = inject(LanguageService);

  public get currentLang(): string {
    return this.languageService.current;
  }

  public get currentOption(): LanguageOption | undefined {
    return this.languages.find(l => l.code === this.currentLang);
  }

  public setLanguage(code: string): void {
    this.languageService.setLanguage(code);
  }
}
