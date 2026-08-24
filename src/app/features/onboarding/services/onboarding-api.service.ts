import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Genre } from '../../../core/models/genre';
import { Movie } from '../../../core/models/movie';

@Injectable({ providedIn: 'root' })
export class OnboardingApiService {
  constructor(private readonly http: HttpClient) {}

  public getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${environment.apiUrl}/genres`);
  }

  public getSeedMovies(count = 30): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.apiUrl}/recommendations/popular`, {
      params: new HttpParams().set('count', count),
    });
  }
}
