import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Movie } from '../../../core/models/movie';

@Injectable({ providedIn: 'root' })
export class DiscoverApiService {
  private readonly baseUrl = `${environment.apiUrl}/recommendations`;

  constructor(private readonly http: HttpClient) {}

  public getForYou(count = 20): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/for-you`, {
      params: new HttpParams().set('count', count),
    });
  }

  public getColdStart(count = 20): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/cold-start`, {
      params: new HttpParams().set('count', count),
    });
  }

  public getTrendingMovies(days = 7, count = 20): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/trending/movies`, {
      params: new HttpParams().set('days', days).set('count', count),
    });
  }

  public getTrendingSeries(days = 7, count = 20): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/trending/series`, {
      params: new HttpParams().set('days', days).set('count', count),
    });
  }

  public getPopular(opts: { genre?: string; type?: 'Movie' | 'Series'; count?: number } = {}): Observable<Movie[]> {
    let params = new HttpParams().set('count', opts.count ?? 20);
    if (opts.genre) params = params.set('genre', opts.genre);
    if (opts.type) params = params.set('type', opts.type);
    return this.http.get<Movie[]>(`${this.baseUrl}/popular`, { params });
  }

  public getBecauseYouLiked(movieId: string, count = 12): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/because-you-liked/${movieId}`, {
      params: new HttpParams().set('count', count),
    });
  }
}
