import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AppIcon } from '../../../../core/constants/app-icons';
import { AppRoutes } from '../../../../core/constants/app-routes';
import { FilterService, FilterState } from '../../../../core/services/filter.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  public readonly AppIcon = AppIcon;

  public readonly genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
    'Romance', 'Thriller', 'Animation', 'Documentary', 'Fantasy',
  ];

  public readonly sortOptions: { label: string; value: FilterState['sortBy'] }[] = [
    { label: 'FILTERS.SORT.POPULAR', value: 'popular' },
    { label: 'FILTERS.SORT.TOP_RATED', value: 'top_rated' },
    { label: 'FILTERS.SORT.NEWEST', value: 'newest' },
    { label: 'FILTERS.SORT.OLDEST', value: 'oldest' },
  ];

  public readonly ratingOptions = [5, 6, 7, 8, 9];

  public draft: FilterState = this.copyFilters();

  constructor(
    private readonly filterService: FilterService,
    private readonly router: Router,
    private readonly location: Location,
  ) {}

  public setSortBy(value: FilterState['sortBy']): void {
    this.draft = { ...this.draft, sortBy: value };
  }

  public toggleGenre(genre: string): void {
    const idx = this.draft.genres.indexOf(genre);
    if (idx === -1) {
      this.draft = { ...this.draft, genres: [...this.draft.genres, genre] };
    } else {
      this.draft = { ...this.draft, genres: this.draft.genres.filter(g => g !== genre) };
    }
  }

  public setRating(rating: number): void {
    this.draft = { ...this.draft, minRating: this.draft.minRating === rating ? null : rating };
  }

  public applyFilters(): void {
    this.filterService.apply(this.draft);
    this.router.navigate(['/', AppRoutes.MOVIES]);
  }

  public resetFilters(): void {
    this.filterService.reset();
    this.draft = this.copyFilters();
  }

  public goBack(): void {
    this.location.back();
  }

  private copyFilters(): FilterState {
    const f = this.filterService.current;
    return { ...f, genres: [...f.genres] };
  }
}
