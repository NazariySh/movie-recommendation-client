import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { AppRoutes } from '../../../../core/constants/app-routes';
import { AppIcon } from '../../../../core/constants/app-icons';
import { ArtistSuggestion, MovieSuggestion, SearchSuggestions } from '../../models/search.model';
import { SearchApiService } from '../../services/search-api.service';
import { SearchHistoryService } from '../../services/search-history.service';

type DropdownItem =
  | { kind: 'history'; query: string }
  | { kind: 'movie'; data: MovieSuggestion }
  | { kind: 'artist'; data: ArtistSuggestion }
  | { kind: 'see-all'; query: string };

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule, TranslateModule],
})
export class SearchBarComponent implements OnInit {
  @ViewChild('inputEl') public inputEl!: ElementRef<HTMLInputElement>;

  public readonly query = new FormControl('', { nonNullable: true });
  public readonly AppIcon = AppIcon;

  public open = false;
  public loading = false;
  public history: string[] = [];
  public suggestions: SearchSuggestions = { movies: [], artists: [] };
  public selectedIndex = -1;

  public constructor(
    private readonly api: SearchApiService,
    private readonly historyService: SearchHistoryService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly hostEl: ElementRef<HTMLElement>,
    private readonly destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.historyService.entries$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((entries) => {
        this.history = entries.slice(0, 5);
        this.cdr.markForCheck();
      });

    this.query.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_MS),
        distinctUntilChanged(),
        switchMap((q) => this.fetchSuggestions(q)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((s) => {
        this.suggestions = s;
        this.loading = false;
        this.selectedIndex = -1;
        this.cdr.markForCheck();
      });
  }

  public onFocus(): void {
    this.open = true;
  }

  public onClear(event: Event): void {
    event.stopPropagation();
    this.query.setValue('');
    this.suggestions = { movies: [], artists: [] };
    this.inputEl?.nativeElement.focus();
  }

  public onSubmit(): void {
    const items = this.flattenedItems();
    if (this.selectedIndex >= 0 && this.selectedIndex < items.length) {
      this.activate(items[this.selectedIndex]);
      return;
    }

    const q = this.query.value.trim();
    if (q.length === 0) return;

    this.historyService.add(q);
    this.router.navigate(['/', AppRoutes.SEARCH], { queryParams: { q } });
    this.close();
  }

  public selectHistoryItem(query: string): void {
    this.query.setValue(query);
    this.router.navigate(['/', AppRoutes.SEARCH], { queryParams: { q: query } });
    this.close();
  }

  public selectMovie(movie: MovieSuggestion): void {
    this.historyService.add(this.query.value);
    this.router.navigate(['/', AppRoutes.MOVIE_DETAIL, movie.id]);
    this.close();
  }

  public selectArtist(artist: ArtistSuggestion): void {
    this.historyService.add(this.query.value);
    this.router.navigate(['/', AppRoutes.ARTISTS, artist.id]);
    this.close();
  }

  public removeHistory(query: string, event: Event): void {
    event.stopPropagation();
    this.historyService.remove(query);
  }

  public clearHistory(event: Event): void {
    event.stopPropagation();
    this.historyService.clear();
  }

  public get hasContent(): boolean {
    return this.suggestions.movies.length > 0 || this.suggestions.artists.length > 0;
  }

  public get hasMinQuery(): boolean {
    return this.query.value.trim().length >= MIN_QUERY_LENGTH;
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    if (!this.open) return;
    if (!this.hostEl.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    if (!this.open) return;

    const items = this.flattenedItems();

    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
      this.cdr.markForCheck();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
      this.cdr.markForCheck();
    }
  }

  private close(): void {
    this.open = false;
    this.selectedIndex = -1;
    this.cdr.markForCheck();
  }

  private fetchSuggestions(q: string): Observable<SearchSuggestions> {
    if (q.trim().length < MIN_QUERY_LENGTH) {
      return of<SearchSuggestions>({ movies: [], artists: [] });
    }
    this.loading = true;
    this.cdr.markForCheck();
    return this.api.getSuggestions(q, 5);
  }

  private flattenedItems(): DropdownItem[] {
    const result: DropdownItem[] = [];

    if (!this.hasMinQuery) {
      this.history.forEach((q) => result.push({ kind: 'history', query: q }));
      return result;
    }

    this.suggestions.movies.forEach((m) => result.push({ kind: 'movie', data: m }));
    this.suggestions.artists.forEach((a) => result.push({ kind: 'artist', data: a }));

    if (this.hasContent) {
      result.push({ kind: 'see-all', query: this.query.value });
    }

    return result;
  }

  private activate(item: DropdownItem): void {
    switch (item.kind) {
      case 'history':
        this.selectHistoryItem(item.query);
        break;
      case 'movie':
        this.selectMovie(item.data);
        break;
      case 'artist':
        this.selectArtist(item.data);
        break;
      case 'see-all':
        this.historyService.add(item.query);
        this.router.navigate(['/', AppRoutes.SEARCH], { queryParams: { q: item.query } });
        this.close();
        break;
    }
  }
}
