import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedList } from '../models/paged-list';
import {
  UpdateWatchlistStatusRequest,
  UpsertWatchlistRequest,
  WatchlistItem,
  WatchlistStatus,
} from '../models/watchlist';
import { toHttpParams } from '../../shared/utils/to-http-params';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly apiUrl = `${environment.apiUrl}/users/me/watchlist`;

  constructor(private readonly http: HttpClient) {}

  public getMyWatchlist(
    status?: WatchlistStatus,
    pageNumber = 1,
    pageSize = 20,
  ): Observable<PagedList<WatchlistItem>> {
    const params = toHttpParams({
      status: status ?? null,
      pageNumber,
      pageSize,
    });
    return this.http.get<PagedList<WatchlistItem>>(this.apiUrl, { params });
  }

  public getStatus(movieId: string): Observable<WatchlistStatus | null> {
    return this.http.get<WatchlistStatus | null>(`${this.apiUrl}/${movieId}`);
  }

  public upsert(request: UpsertWatchlistRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, request);
  }

  public updateStatus(movieId: string, request: UpdateWatchlistStatusRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${movieId}`, request);
  }

  public remove(movieId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${movieId}`);
  }
}
