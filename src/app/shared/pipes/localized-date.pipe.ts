import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

type LocalizedDateFormat = 'long' | 'medium' | 'short' | 'year';

const FORMAT_OPTIONS: Record<LocalizedDateFormat, Intl.DateTimeFormatOptions> = {
  long: { year: 'numeric', month: 'long', day: 'numeric' },
  medium: { year: 'numeric', month: 'short', day: 'numeric' },
  short: { year: 'numeric', month: '2-digit', day: '2-digit' },
  year: { year: 'numeric' },
};

@Pipe({ name: 'localizedDate', pure: false })
export class LocalizedDatePipe implements PipeTransform, OnDestroy {
  private cachedKey = '';
  private cachedRender = '';
  private readonly langChangeSub: Subscription;

  public constructor(
    private readonly translate: TranslateService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      this.cachedKey = '';
      this.cdr.markForCheck();
    });
  }

  public transform(
    value: string | Date | null | undefined,
    format: LocalizedDateFormat = 'long',
  ): string {
    if (!value) return '';

    const lang = this.translate.getCurrentLang();
    const key = `${typeof value === 'string' ? value : value.toISOString()}|${format}|${lang}`;
    if (key === this.cachedKey) {
      return this.cachedRender;
    }

    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) {
      return '';
    }

    this.cachedKey = key;
    this.cachedRender = new Intl.DateTimeFormat(lang, FORMAT_OPTIONS[format]).format(date);
    return this.cachedRender;
  }

  public ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
  }
}
