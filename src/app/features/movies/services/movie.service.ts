import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Genre } from '../../../core/models/genre';
import { Movie } from '../../../core/models/movie';
import { MovieDetail } from '../../../core/models/movie-detail';
import { MovieListItem } from '../../../core/models/movie-list-item';
import { PagedList } from '../../../core/models/paged-list';
import { CatalogFilters } from '../models/catalog-filters';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly moviesUrl = `${environment.apiUrl}/movies`;
  private readonly genresUrl = `${environment.apiUrl}/genres`;

  constructor(private readonly http: HttpClient) {}

  public getMovieByKey(key: string): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${this.moviesUrl}/${key}`);
  }

  public getMovieById(id: string): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${this.moviesUrl}/${id}`);
  }

  public getRecommendedMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.moviesUrl}/recommended`);
  }

  public getTrendingMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.moviesUrl}/trending`);
  }

  public getCatalog(filters: CatalogFilters): Observable<PagedList<MovieListItem>> {
    return this.http.get<PagedList<MovieListItem>>(this.moviesUrl, { params: this.buildParams(filters) });
  }

  public getSimilar(id: string, count = 12): Observable<MovieListItem[]> {
    return this.http.get<MovieListItem[]>(`${this.moviesUrl}/${id}/similar`, {
      params: new HttpParams().set('count', count),
    });
  }

  public getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.genresUrl);
  }

  private buildParams(filters: CatalogFilters): HttpParams {
    let params = new HttpParams()
      .set('pageNumber', filters.page)
      .set('pageSize', filters.pageSize)
      .set('sortBy', filters.sort)
      .set('sortDescending', filters.order === 'desc');

    if (filters.search) params = params.set('search', filters.search);
    if (filters.type !== 'all') params = params.set('type', filters.type);
    for (const slug of filters.genres) {
      params = params.append('genreSlugs', slug);
    }

    const yearFrom = filters.years.length ? Math.min(...filters.years) : filters.yearFrom;
    const yearTo = filters.years.length ? Math.max(...filters.years) : filters.yearTo;
    if (yearFrom !== null) params = params.set('yearFrom', yearFrom);
    if (yearTo !== null) params = params.set('yearTo', yearTo);
    if (filters.minRating !== null) params = params.set('minRating', filters.minRating);
    if (filters.maxRating !== null) params = params.set('maxRating', filters.maxRating);
    if (filters.runtimeMin !== null) params = params.set('runtimeMin', filters.runtimeMin);
    if (filters.runtimeMax !== null) params = params.set('runtimeMax', filters.runtimeMax);
    if (filters.language) params = params.set('language', filters.language);

    return params;
  }
}
