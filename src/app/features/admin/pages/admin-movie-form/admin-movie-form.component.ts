import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { MovieService } from '../../../movies/services/movie.service';
import { Genre } from '../../../../core/models/genre';
import { MovieDetail } from '../../../../core/models/movie-detail';
import { AdminMovieFormDto } from '../../models/admin-models';
import { AdminMoviesService } from '../../services/admin-movies.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-admin-movie-form',
  templateUrl: './admin-movie-form.component.html',
  styleUrl: './admin-movie-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMovieFormComponent implements OnInit {
  public form!: FormGroup;
  public genres: Genre[] = [];
  public loading = false;
  public saving = false;
  public movieId: string | null = null;
  public readonly types = ['Movie', 'Series'];
  public readonly statuses = ['Released', 'In Production', 'Upcoming'];

  public constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly catalog: MovieService,
    private readonly api: AdminMoviesService,
    private readonly toast: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

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
      detail: this.movieId ? this.catalog.getMovieById(this.movieId) : of(null as MovieDetail | null),
    }).subscribe({
      next: ({ genres, detail }) => {
        this.genres = genres;
        if (detail) this.populateFromDetail(detail);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
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
      this.api.update(id, dto).subscribe({
        next: () => {
          this.saving = false;
          this.cdr.markForCheck();
          this.toast.success('ADMIN.MOVIES.UPDATED');
          this.router.navigate(['/admin/movies', id, 'edit']);
        },
        error: () => { this.saving = false; this.cdr.markForCheck(); },
      });
    } else {
      this.api.create(dto).subscribe({
        next: result => {
          this.saving = false;
          this.cdr.markForCheck();
          this.toast.success('ADMIN.MOVIES.CREATED');
          this.router.navigate(['/admin/movies', result.id, 'edit']);
        },
        error: () => { this.saving = false; this.cdr.markForCheck(); },
      });
    }
  }

  public cancel(): void {
    this.router.navigate(['/admin/movies']);
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
      budget: [null],
      revenue: [null],
      imdbId: [''],
      tmdbId: [null],
      seasonsCount: [null],
      episodesCount: [null],
      isOngoing: [null],
      genreIds: [[] as number[]],
      translations: this.fb.array([]),
    });
  }

  private populateFromDetail(detail: MovieDetail): void {
    this.form.patchValue({
      key: detail.key,
      type: detail.type === 'Series' ? 'Series' : 'Movie',
      status: detail.status,
      originalTitle: detail.originalTitle,
      originalLang: 'en',
      posterUrl: detail.posterUrl,
      backdropUrl: detail.backdropUrl,
      releaseDate: detail.releaseDate,
      runtime: detail.runtime,
      seasonsCount: detail.seasonsCount,
      episodesCount: detail.episodesCount,
      isOngoing: detail.isOngoing,
      genreIds: [],
    });
    this.translations.push(this.fb.group({
      languageCode: ['uk', Validators.required],
      title: [detail.title, Validators.required],
      overview: [detail.overview ?? ''],
      tagline: [''],
    }));
  }
}
