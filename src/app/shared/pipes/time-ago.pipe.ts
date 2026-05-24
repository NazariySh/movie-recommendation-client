import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  constructor(private readonly translate: TranslateService) {}

  public transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    const lang = this.translate.currentLang || 'uk';
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });

    if (diffSec < 60) return rtf.format(-diffSec, 'second');
    if (diffMin < 60) return rtf.format(-diffMin, 'minute');
    if (diffHour < 24) return rtf.format(-diffHour, 'hour');
    if (diffDay < 30) return rtf.format(-diffDay, 'day');
    const diffMonth = Math.floor(diffDay / 30);
    if (diffMonth < 12) return rtf.format(-diffMonth, 'month');
    return rtf.format(-Math.floor(diffMonth / 12), 'year');
  }
}
