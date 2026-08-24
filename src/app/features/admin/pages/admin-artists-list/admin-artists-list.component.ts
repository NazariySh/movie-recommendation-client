import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';
import { ArtistService } from '../../../artists/services/artist.service';
import { Artist } from '../../../../core/models/artist';
import { AdminArtistsService } from '../../services/admin-artists.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmActionDialogComponent } from '../../components/confirm-action-dialog/confirm-action-dialog.component';
import { AdminRoutes, AppPaths } from '../../../../core/constants/app-routes';
import {
  ADMIN_DEFAULT_PAGE_SIZE,
  ADMIN_DELETE_TYPED_CONFIRMATION,
  ADMIN_FILTER_DEBOUNCE_MS,
  ADMIN_PAGE_SIZE_OPTIONS,
} from '../../admin.constants';

interface ListState {
  search: string;
  pageNumber: number;
  pageSize: number;
}

const INITIAL_STATE: ListState = {
  search: '',
  pageNumber: 1,
  pageSize: ADMIN_DEFAULT_PAGE_SIZE,
};

@Component({
  selector: 'app-admin-artists-list',
  templateUrl: './admin-artists-list.component.html',
  styleUrl: './admin-artists-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminArtistsListComponent implements OnInit {
  private readonly state$ = new BehaviorSubject<ListState>(INITIAL_STATE);

  public readonly displayedColumns = ['photo', 'name', 'department', 'movies', 'actions'];
  public readonly pageSizeOptions = ADMIN_PAGE_SIZE_OPTIONS;
  public readonly searchControl = new FormControl(INITIAL_STATE.search, { nonNullable: true });
  public readonly AppPaths = AppPaths;
  public readonly AdminRoutes = AdminRoutes;

  public artists: Artist[] = [];
  public totalCount = 0;
  public loading = true;

  public constructor(
    private readonly artistsApi: ArtistService,
    private readonly adminApi: AdminArtistsService,
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
          return this.artistsApi.getArtists({
            search: state.search.trim() || undefined,
            pageNumber: state.pageNumber,
            pageSize: state.pageSize,
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (page) => {
          this.artists = page.items;
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

  public onPage(event: { pageIndex: number; pageSize: number }): void {
    this.patchState({ pageNumber: event.pageIndex + 1, pageSize: event.pageSize });
  }

  public createNew(): void {
    this.router.navigate([AppPaths.ADMIN, AdminRoutes.ARTISTS, AdminRoutes.ARTISTS_NEW]);
  }

  public edit(artist: Artist): void {
    this.router.navigate([AppPaths.ADMIN, AdminRoutes.ARTISTS, artist.id, 'edit']);
  }

  public delete(artist: Artist): void {
    const ref = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        titleKey: 'ADMIN.ARTISTS.DELETE_TITLE',
        messageKey: 'ADMIN.ARTISTS.DELETE_MESSAGE',
        messageParams: { name: artist.name },
        requireTypedConfirmation: ADMIN_DELETE_TYPED_CONFIRMATION,
        confirmKey: 'COMMON.DELETE',
        destructive: true,
      },
    });
    ref.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: { confirmed: boolean } | undefined) => {
        if (!result?.confirmed) return;
        this.adminApi.delete(artist.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toast.success('ADMIN.ARTISTS.DELETED');
              this.reload();
            },
            error: () => this.toast.error('ADMIN.ARTISTS.DELETE_FAILED'),
          });
      });
  }

  private patchState(partial: Partial<ListState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }

  private reload(): void {
    this.state$.next({ ...this.state$.value });
  }
}
