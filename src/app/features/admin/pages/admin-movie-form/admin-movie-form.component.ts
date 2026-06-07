import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { MovieService } from '../../../movies/services/movie.service';
import { Genre } from '../../../../core/models/genre';
import { AdminMovieDetail, AdminMovieFormDto } from '../../models/admin-models';
import { AdminMoviesService } from '../../services/admin-movies.service';
import { AdminPaths } from '../../../../core/constants/app-routes';
import { FormComponent } from '../../../../shared/form/form-component';

@Component({
  selector: 'app-admin-movie-form',
  templateUrl: './admin-movie-form.component.html',
  styleUrl: './admin-movie-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMovieFormComponent extends FormComponent implements OnInit {
  public form!: FormGroup;
  public genres: Genre[] = [];
  public loading = false;
  public saving = false;
  public movieId: string | null = null;
  public posterFile: File | null = null;
  public backdropFile: File | null = null;
  public readonly types = ['Movie', 'Series'];
  public readonly statuses = ['Released', 'In Production', 'Upcoming'];
  public readonly moviesLink = AdminPaths.MOVIES;

  public constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly catalog: MovieService,
    private readonly api: AdminMoviesService,
    private readonly destroyRef: DestroyRef,
  ) {
    super();
  }

  public get translations(): FormArray {
    return this.form.get('translations') as FormArray;
  }

  public ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    this.form = this.buildForm();

    this.loading = true;
    this.cdr.markForCheck();
    forkJoin({
      genres: this.catalog.getGenres(),
      detail: this.movieId ? this.api.getById(this.movieId) : of(null as AdminMovieDetail | null),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ genres, detail }) => {
          this.genres = genres;
          if (detail) this.populateFromDetail(detail);
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
          this.toast.error('ADMIN.MOVIES.LOAD_FAILED');
        },
      });
  }

  public addTranslation(): void {
    this.translations.push(this.fb.group({
      languageCode: ['uk', Validators.required],
      title: ['', Validators.required],
      overview: [''],
      tagline: [''],
    }));
  }

  public removeTranslation(index: number): void {
    this.translations.removeAt(index);
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.value as AdminMovieFormDto;
    this.saving = true;
    this.cdr.markForCheck();

    if (this.movieId) {
      const id = this.movieId;
      this.api.update(id, dto, this.posterFile, this.backdropFile)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.saving = false;
            this.cdr.markForCheck();
            this.toast.success('ADMIN.MOVIES.UPDATED');
            this.router.navigate([AdminPaths.MOVIES, id, 'edit']);
          },
          error: (err: HttpErrorResponse) => this.onSubmitError(err),
        });
    } else {
      this.api.create(dto, this.posterFile, this.backdropFile)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: result => {
            this.saving = false;
            this.cdr.markForCheck();
            this.toast.success('ADMIN.MOVIES.CREATED');
            this.router.navigate([AdminPaths.MOVIES, result.id, 'edit']);
          },
          error: (err: HttpErrorResponse) => this.onSubmitError(err),
        });
    }
  }

  private onSubmitError(err: HttpErrorResponse): void {
    this.saving = false;
    if (err.status === 400 || err.status === 422) {
      this.handleValidationError(err);
    } else {
      this.toast.error('ADMIN.MOVIES.SAVE_FAILED');
    }
    this.cdr.markForCheck();
  }

  public cancel(): void {
    this.router.navigate([AdminPaths.MOVIES]);
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      key: [''],
      type: ['Movie', Validators.required],
      status: ['Released', Validators.required],
      originalTitle: ['', Validators.required],
      originalLang: ['en', Validators.required],
      posterUrl: [''],
      backdropUrl: [''],
      trailerYoutubeId: [''],
      releaseDate: [null],
      runtime: [null],
      imdbId: [''],
      tmdbId: [null],
      seasonsCount: [null],
      episodesCount: [null],
      isOngoing: [null],
      genreIds: [[] as number[]],
      translations: this.fb.array([]),
    });
  }

  private populateFromDetail(detail: AdminMovieDetail): void {
    this.form.patchValue({
      key: detail.key,
      type: detail.type,
      status: detail.status,
      originalTitle: detail.originalTitle,
      originalLang: detail.originalLang,
      posterUrl: detail.posterUrl,
      backdropUrl: detail.backdropUrl,
      trailerYoutubeId: detail.trailerYoutubeId,
      releaseDate: detail.releaseDate ? detail.releaseDate.substring(0, 10) : null,
      runtime: detail.runtime,
      imdbId: detail.imdbId,
      tmdbId: detail.tmdbId,
      seasonsCount: detail.seasonsCount,
      isOngoing: detail.isOngoing,
      genreIds: detail.genreIds,
    });

    this.translations.clear();
    for (const t of detail.translations) {
      this.translations.push(this.fb.group({
        languageCode: [t.languageCode, Validators.required],
        title: [t.title, Validators.required],
        overview: [t.overview ?? ''],
        tagline: [t.tagline ?? ''],
      }));
    }
  }
}
