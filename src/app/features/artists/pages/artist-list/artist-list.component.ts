import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Artist } from '../../../../core/models/artist';
import { PagedList } from '../../../../core/models/paged-list';
import { SelectItem } from '../../../../core/models/select-item';
import { SelectValue } from '../../../../shared/components/select/select.component';
import { PaginatorPageChange } from '../../../../shared/components/paginator/paginator.component';
import { AppIcon } from '../../../../core/constants/app-icons';
import { ArtistService } from '../../services/artist.service';

interface RoleTab {
  id: string;
  labelKey: string;
}

type SortKey = 'popular' | 'name' | 'recent';

const PAGE_SIZE = 12;

const DEFAULTS = {
  search: '',
  role: 'all',
  sortBy: 'popular' as SortKey,
  page: 1,
};

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrl: './artist-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistListComponent implements OnInit {
  public readonly AppIcon = AppIcon;
  public readonly pageSize = PAGE_SIZE;

  public readonly roleTabs: RoleTab[] = [
    { id: 'all', labelKey: 'ARTISTS.ROLE.ALL' },
    { id: 'acting', labelKey: 'ARTISTS.ROLE.ACTOR' },
    { id: 'directing', labelKey: 'ARTISTS.ROLE.DIRECTOR' },
    { id: 'writing', labelKey: 'ARTISTS.ROLE.WRITER' },
    { id: 'production', labelKey: 'ARTISTS.ROLE.PRODUCER' },
  ];

  public readonly sortItems: SelectItem[] = [
    { value: 'popular', label: 'ARTISTS.SORT.POPULAR' },
    { value: 'name', label: 'ARTISTS.SORT.NAME' },
    { value: 'recent', label: 'ARTISTS.SORT.RECENT' },
  ];

  public readonly skeletonSlots = Array.from({ length: PAGE_SIZE });

  public readonly searchControl = new FormControl(DEFAULTS.search, { nonNullable: true });

  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public readonly error$ = new BehaviorSubject<boolean>(false);

  public readonly role$ = new BehaviorSubject<string>(DEFAULTS.role);
  public readonly sortBy$ = new BehaviorSubject<SortKey>(DEFAULTS.sortBy);
  public readonly page$ = new BehaviorSubject<number>(DEFAULTS.page);

  public artists$!: Observable<PagedList<Artist>>;

  constructor(
    private readonly artistService: ArtistService,
    private readonly destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.page$.next(1));

    this.artists$ = this.initTableStream();
  }

  public setRole(role: string): void {
    this.role$.next(role);
    this.page$.next(1);
  }

  public onSortChange(value: SelectValue): void {
    if (typeof value !== 'string') return;
    this.sortBy$.next(value as SortKey);
    this.page$.next(1);
  }

  public onPageChange(event: PaginatorPageChange): void {
    this.page$.next(event.pageNumber);
  }

  private initTableStream(): Observable<PagedList<Artist>> {
    const search$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(250),
      distinctUntilChanged(),
    );

    return combineLatest([search$, this.role$, this.sortBy$, this.page$]).pipe(
      tap(() => {
        this.loading$.next(true);
        this.error$.next(false);
      }),
      switchMap(([search, role, sortBy, page]) =>
        this.artistService
          .getArtists({
            search: search.trim() || undefined,
            role: role === 'all' ? undefined : role,
            sortBy,
            pageNumber: page,
            pageSize: PAGE_SIZE,
          })
          .pipe(
            catchError(() => {
              this.error$.next(true);
              return of(this.emptyPage(page));
            }),
          ),
      ),
      tap(() => this.loading$.next(false)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  private emptyPage(page: number): PagedList<Artist> {
    return {
      items: [],
      pageNumber: page,
      pageSize: PAGE_SIZE,
      totalCount: 0,
      totalPages: 0,
    };
  }
}
