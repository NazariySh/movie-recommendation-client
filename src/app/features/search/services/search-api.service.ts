import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Artist } from '../../../core/models/artist';
import { MovieListItem } from '../../../core/models/movie-list-item';
import { PagedList } from '../../../core/models/paged-list';
import { SearchCounts, SearchSuggestions, SemanticSearchMoviesResult } from '../models/search.model';

@Injectable({ providedIn: 'root' })
export class SearchApiService {
  private readonly baseUrl = `${environment.apiUrl}/search`;
  private readonly moviesUrl = `${environment.apiUrl}/movies`;
  private readonly artistsUrl = `${environment.apiUrl}/artists`;

  constructor(private readonly http: HttpClient) {}

  public getSuggestions(query: string, limit = 5): Observable<SearchSuggestions> {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) {
      return of<SearchSuggestions>({ movies: [], artists: [] });
    }

    return this.http.get<SearchSuggestions>(`${this.baseUrl}/suggestions`, {
      params: new HttpParams().set('q', trimmed).set('limit', limit),
    });
  }

  public getCounts(query: string): Observable<SearchCounts> {
    return this.http
      .get<SearchCounts>(`${this.baseUrl}/counts`, {
        params: new HttpParams().set('q', query.trim()),
      })
      .pipe(map((c) => c ?? { total: 0, movies: 0, series: 0, artists: 0 }));
  }

  public searchMovies(
    query: string,
    type: 'Movie' | 'Series' | null = null,
    page = 1,
    pageSize = 20,
  ): Observable<PagedList<MovieListItem>> {
    let params = new HttpParams()
      .set('search', query.trim())
      .set('pageNumber', page)
      .set('pageSize', pageSize);

    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<PagedList<MovieListItem>>(this.moviesUrl, { params });
  }

  public searchArtists(query: string, page = 1, pageSize = 20): Observable<PagedList<Artist>> {
    const params = new HttpParams()
      .set('search', query.trim())
      .set('pageNumber', page)
      .set('pageSize', pageSize);
    return this.http.get<PagedList<Artist>>(this.artistsUrl, { params });
  }

  public searchSemantic(query: string, limit = 40): Observable<SemanticSearchMoviesResult> {
    return this.http.get<SemanticSearchMoviesResult>(`${this.baseUrl}/semantic`, {
      params: new HttpParams().set('q', query.trim()).set('limit', limit),
    });
  }
}
