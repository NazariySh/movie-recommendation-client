import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Artist } from '../../../core/models/artist';
import { ArtistDetail } from '../../../core/models/artist-detail';
import { PagedList } from '../../../core/models/paged-list';
import { toHttpParams } from '../../../shared/utils/to-http-params';

export interface ArtistSearchQuery {
  search?: string;
  role?: string;
  sortBy?: 'popular' | 'name' | 'recent';
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private readonly apiUrl = `${environment.apiUrl}/artists`;

  constructor(private readonly http: HttpClient) {}

  public getArtists(query: ArtistSearchQuery = {}): Observable<PagedList<Artist>> {
    const params = toHttpParams({
      search: query.search ?? null,
      role: query.role ?? null,
      sortBy: query.sortBy ?? null,
      pageNumber: query.pageNumber ?? 1,
      pageSize: query.pageSize ?? 12,
    });

    return this.http.get<PagedList<Artist>>(this.apiUrl, { params });
  }

  public getArtistById(id: string): Observable<ArtistDetail> {
    return this.http.get<ArtistDetail>(`${this.apiUrl}/${id}`);
  }
}
