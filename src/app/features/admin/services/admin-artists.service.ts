import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminArtistFormDto } from '../models/admin-models';

interface CreateResponse {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class AdminArtistsService {
  private readonly apiUrl = `${environment.apiUrl}/admin/artists`;

  constructor(private readonly http: HttpClient) {}

  public create(dto: AdminArtistFormDto): Observable<CreateResponse> {
    return this.http.post<CreateResponse>(this.apiUrl, dto);
  }

  public update(id: string, dto: AdminArtistFormDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
