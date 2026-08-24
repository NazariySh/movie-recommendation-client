import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { GenrePreference } from '../../models/profile.model';
import { ProfileApiService } from '../../services/profile-api.service';

interface GenreRow {
  genreId: number;
  slug: string;
  name: string;
  weight: number;
}

@Component({
  selector: 'app-genre-preferences-tab',
  templateUrl: './genre-preferences-tab.component.html',
  styleUrl: './genre-preferences-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenrePreferencesTabComponent implements OnInit {
  public rows: GenreRow[] = [];
  public loading = true;
  public saving = false;

  public constructor(
    private readonly api: ProfileApiService,
    private readonly toast: ToastService,
    private readonly translate: TranslateService,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.api.getMyGenrePreferences()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (prefs) => {
          this.rows = this.toRows(prefs);
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  public onWeightChange(row: GenreRow, value: number): void {
    row.weight = Math.min(100, Math.max(0, value)) / 100;
  }

  public onWeightInput(row: GenreRow, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    if (Number.isNaN(value)) return;
    this.onWeightChange(row, value);
  }

  public sliderPct(row: GenreRow): number {
    return Math.round(row.weight * 100);
  }

  public async save(): Promise<void> {
    if (this.saving) return;
    this.saving = true;
    this.cdr.markForCheck();
    try {
      const payload = this.rows.map((r) => ({ genreId: r.genreId, weight: r.weight }));
      const updated = await firstValueFrom(
        this.api.updateGenrePreferences(payload).pipe(takeUntilDestroyed(this.destroyRef)),
      );
      this.rows = this.toRows(updated);
      this.toast.success(this.translate.instant('PROFILE.PREFERENCES_SAVED'));
    } catch {
      this.toast.error(this.translate.instant('PROFILE.PREFERENCES_SAVE_FAILED'));
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  public get topGenres(): GenreRow[] {
    return [...this.rows]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5)
      .filter((r) => r.weight > 0);
  }

  private toRows(prefs: GenrePreference[]): GenreRow[] {
    return prefs
      .map((p) => ({ genreId: p.genreId, slug: p.slug, name: p.name, weight: Number(p.weight) || 0 }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
