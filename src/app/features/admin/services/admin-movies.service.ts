import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminMovieFormDto } from '../models/admin-models';

interface CreateResponse {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class AdminMoviesService {
  private readonly apiUrl = `${environment.apiUrl}/admin/movies`;

  constructor(private readonly http: HttpClient) {}

  public create(dto: AdminMovieFormDto): Observable<CreateResponse> {
    return this.http.post<CreateResponse>(this.apiUrl, dto);
  }

  public update(id: string, dto: AdminMovieFormDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public regenerateEmbedding(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/regenerate-embedding`, {});
  }
}
