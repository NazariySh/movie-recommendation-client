import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';
import { MovieService } from '../../../movies/services/movie.service';
import { CatalogFilters, DEFAULT_FILTERS } from '../../../movies/models/catalog-filters';
import { MovieListItem } from '../../../../core/models/movie-list-item';
import { TitleType } from '../../../../core/models/title-type';
import { AdminMoviesService } from '../../services/admin-movies.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmActionDialogComponent } from '../../components/confirm-action-dialog/confirm-action-dialog.component';
import { AdminPaths } from '../../../../core/constants/app-routes';
import {
  ADMIN_DEFAULT_PAGE_SIZE,
  ADMIN_DELETE_TYPED_CONFIRMATION,
  ADMIN_FILTER_DEBOUNCE_MS,
  ADMIN_PAGE_SIZE_OPTIONS,
} from '../../admin.constants';

type TypeFilter = 'all' | TitleType;

interface ListState {
  search: string;
  type: TypeFilter;
  pageNumber: number;
  pageSize: number;
}

const INITIAL_STATE: ListState = {
  search: '',
  type: 'all',
  pageNumber: 1,
  pageSize: ADMIN_DEFAULT_PAGE_SIZE,
};

@Component({
  selector: 'app-admin-movies-list',
  templateUrl: './admin-movies-list.component.html',
  styleUrl: './admin-movies-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMoviesListComponent implements OnInit {
  private readonly state$ = new BehaviorSubject<ListState>(INITIAL_STATE);

  public readonly displayedColumns = ['poster', 'title', 'type', 'year', 'rating', 'actions'];
  public readonly pageSizeOptions = ADMIN_PAGE_SIZE_OPTIONS;
  public readonly searchControl = new FormControl(INITIAL_STATE.search, { nonNullable: true });

  public movies: MovieListItem[] = [];
  public totalCount = 0;
  public loading = true;

  public constructor(
    private readonly catalog: MovieService,
    private readonly adminMovies: AdminMoviesService,
    private readonly toast: ToastService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public get state(): ListState {
    return this.state$.value;
  }

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(ADMIN_FILTER_DEBOUNCE_MS), takeUntilDestroyed(this.destroyRef))
      .subscribe((search) => this.patchState({ search, pageNumber: 1 }));

    this.state$
      .pipe(
        switchMap((state) => {
          this.loading = true;
          this.cdr.markForCheck();
          return this.catalog.getCatalog(this.toCatalogFilters(state));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (page) => {
          this.movies = page.items;
          this.totalCount = page.totalCount;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  public onTypeChange(type: TypeFilter): void {
    this.patchState({ type, pageNumber: 1 });
  }

  public onPage(event: { pageIndex: number; pageSize: number }): void {
    this.patchState({ pageNumber: event.pageIndex + 1, pageSize: event.pageSize });
  }

  public createNew(): void {
    this.router.navigate([AdminPaths.MOVIES_NEW]);
  }

  public edit(movie: MovieListItem): void {
    this.router.navigate([AdminPaths.MOVIES, movie.id, 'edit']);
  }

  public regenerateEmbedding(movie: MovieListItem): void {
    this.adminMovies.regenerateEmbedding(movie.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.toast.success('ADMIN.MOVIES.EMBEDDING_REGENERATED'),
        error: () => this.toast.error('ADMIN.MOVIES.EMBEDDING_FAILED'),
      });
  }

  public delete(movie: MovieListItem): void {
    const ref = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        titleKey: 'ADMIN.MOVIES.DELETE_TITLE',
        messageKey: 'ADMIN.MOVIES.DELETE_MESSAGE',
        messageParams: { name: movie.title },
        requireTypedConfirmation: ADMIN_DELETE_TYPED_CONFIRMATION,
        confirmKey: 'COMMON.DELETE',
        destructive: true,
      },
    });
    ref.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: { confirmed: boolean } | undefined) => {
        if (!result?.confirmed) return;
        this.adminMovies.delete(movie.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toast.success('ADMIN.MOVIES.DELETED');
              this.reload();
            },
            error: () => this.toast.error('ADMIN.MOVIES.DELETE_FAILED'),
          });
      });
  }

  private patchState(partial: Partial<ListState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }

  private reload(): void {
    this.state$.next({ ...this.state$.value });
  }

  private toCatalogFilters(state: ListState): CatalogFilters {
    return {
      ...DEFAULT_FILTERS,
      search: state.search.trim(),
      type: state.type,
      page: state.pageNumber,
      pageSize: state.pageSize,
    };
  }
}
