import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { Genre } from '../../../../core/models/genre';
import { Movie } from '../../../../core/models/movie';
import { AuthService } from '../../../../core/services/auth.service';
import { RatingService } from '../../../../core/services/rating.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ProfileApiService } from '../../../profile/services/profile-api.service';
import { SurveyApiService } from '../../../profile/services/survey-api.service';
import { OnboardingApiService } from '../../services/onboarding-api.service';

const MIN_GENRES = 3;
const MIN_RATINGS = 5;
const MOOD_KEYS = ['light_funny', 'dark_serious', 'thought_provoking', 'action_intense', 'romantic', 'scary'] as const;
type MoodKey = (typeof MOOD_KEYS)[number];

const ERA_OPTIONS = ['classic', '70s_80s', '90s_00s', 'modern'] as const;
type EraId = (typeof ERA_OPTIONS)[number];

@Component({
  selector: 'app-onboarding-page',
  templateUrl: './onboarding-page.component.html',
  styleUrl: './onboarding-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingPageComponent implements OnInit {
  public stepIndex = 0;
  public submitting = false;

  public genres: Genre[] = [];
  public seedMovies: Movie[] = [];
  public selectedGenreIds = new Set<number>();
  public ratings = new Map<string, number>();
  public moodScores: Record<MoodKey, number> = {
    light_funny: 3,
    dark_serious: 3,
    thought_provoking: 3,
    action_intense: 3,
    romantic: 3,
    scary: 3,
  };
  public selectedEras = new Set<EraId>();

  public readonly moodKeys = MOOD_KEYS;
  public readonly eraOptions = ERA_OPTIONS;
  public readonly steps = [0, 1, 2, 3, 4];
  public readonly minGenres = MIN_GENRES;
  public readonly minRatings = MIN_RATINGS;

  constructor(
    private readonly api: OnboardingApiService,
    private readonly profileApi: ProfileApiService,
    private readonly surveyApi: SurveyApiService,
    private readonly ratingService: RatingService,
    private readonly auth: AuthService,
    private readonly toast: ToastService,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.api.getGenres().subscribe((genres) => {
      this.genres = genres;
      this.cdr.markForCheck();
    });
    this.api.getSeedMovies(30).subscribe((movies) => {
      this.seedMovies = movies;
      this.cdr.markForCheck();
    });
  }

  public toggleGenre(id: number): void {
    if (this.selectedGenreIds.has(id)) this.selectedGenreIds.delete(id);
    else this.selectedGenreIds.add(id);
  }

  public isGenreSelected(id: number): boolean {
    return this.selectedGenreIds.has(id);
  }

  public setRating(movieId: string, score: number): void {
    if (this.ratings.get(movieId) === score) {
      this.ratings.delete(movieId);
      return;
    }
    this.ratings.set(movieId, score);
  }

  public getRating(movieId: string): number {
    return this.ratings.get(movieId) ?? 0;
  }

  public toggleEra(era: EraId): void {
    if (this.selectedEras.has(era)) this.selectedEras.delete(era);
    else this.selectedEras.add(era);
  }

  public setMood(key: MoodKey, value: number): void {
    this.moodScores[key] = value;
  }

  public canAdvance(): boolean {
    switch (this.stepIndex) {
      case 0: return true;
      case 1: return this.selectedGenreIds.size >= MIN_GENRES;
      case 2: return this.ratings.size >= MIN_RATINGS;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  }

  public next(): void {
    if (!this.canAdvance()) return;
    if (this.stepIndex < this.steps.length - 1) {
      this.stepIndex++;
    }
  }

  public back(): void {
    if (this.stepIndex > 0) this.stepIndex--;
  }

  public skip(): void {
    if (this.stepIndex < this.steps.length - 1) this.stepIndex++;
  }

  public ratingsCount(): number {
    return this.ratings.size;
  }

  public async finish(): Promise<void> {
    if (this.submitting) return;
    this.submitting = true;
    this.cdr.markForCheck();
    try {
      if (this.selectedGenreIds.size > 0) {
        await firstValueFrom(
          this.profileApi.updateGenrePreferences(
            Array.from(this.selectedGenreIds).map((genreId) => ({ genreId, weight: 1 })),
          ),
        );
      }

      for (const [movieId, score] of this.ratings.entries()) {
        try {
          await firstValueFrom(this.ratingService.upsertRating(movieId, score * 2));
        } catch {
          continue;
        }
      }

      await firstValueFrom(
        this.surveyApi.submit({
          version: 1,
          answers: {
            mood_preferences: this.moodScoresPayload(),
            favorite_eras: Array.from(this.selectedEras),
          },
        }),
      );

      await firstValueFrom(this.auth.loadCurrentUser());

      this.toast.success(this.translate.instant('ONBOARDING.DONE_TOAST'));
      this.router.navigate(['/']);
    } catch {
      this.submitting = false;
      this.cdr.markForCheck();
      this.toast.error(this.translate.instant('ONBOARDING.SUBMIT_FAILED'));
    }
  }

  private moodScoresPayload(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const key of MOOD_KEYS) out[key] = this.moodScores[key];
    return out;
  }
}
