import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Pipe({ name: 'runtime', pure: false })
export class RuntimePipe implements PipeTransform, OnDestroy {
  private latestValue: number | null | undefined = null;
  private cachedRender = '—';
  private cachedLang = '';
  private readonly langChangeSub: Subscription;

  public constructor(
    private readonly translate: TranslateService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      this.cachedLang = '';
      this.cdr.markForCheck();
    });
  }

  public transform(minutes: number | null | undefined): string {
    if (minutes === this.latestValue && this.cachedLang === this.translate.getCurrentLang()) {
      return this.cachedRender;
    }
    this.latestValue = minutes;
    this.cachedLang = this.translate.getCurrentLang();
    this.cachedRender = this.format(minutes);
    return this.cachedRender;
  }

  public ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
  }

  private format(minutes: number | null | undefined): string {
    if (!minutes) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const hUnit = this.translate.instant('MOVIE.HOUR_UNIT');
    const mUnit = this.translate.instant('MOVIE.MIN_UNIT');
    if (h === 0) return `${m}${mUnit}`;
    if (m === 0) return `${h}${hUnit}`;
    return `${h}${hUnit} ${m}${mUnit}`;
  }
}
