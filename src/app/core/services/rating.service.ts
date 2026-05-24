import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rating } from '../models/rating';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private readonly moviesUrl = `${environment.apiUrl}/movies`;

  constructor(private readonly http: HttpClient) {}

  public getMyRating(movieId: string): Observable<Rating | null> {
    return this.http.get<Rating | null>(`${this.moviesUrl}/${movieId}/rating/me`);
  }

  public upsertRating(movieId: string, value: number): Observable<Rating> {
    return this.http.put<Rating>(`${this.moviesUrl}/${movieId}/rating`, { value });
  }

  public deleteRating(movieId: string): Observable<void> {
    return this.http.delete<void>(`${this.moviesUrl}/${movieId}/rating`);
  }
}
