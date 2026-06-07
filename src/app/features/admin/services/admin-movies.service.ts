import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminMovieDetail, AdminMovieFormDto } from '../models/admin-models';
import { appendField } from './admin-form-data';

interface CreateResponse {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class AdminMoviesService {
  private readonly apiUrl = `${environment.apiUrl}/admin/movies`;

  public constructor(private readonly http: HttpClient) {}

  public getById(id: string): Observable<AdminMovieDetail> {
    return this.http.get<AdminMovieDetail>(`${this.apiUrl}/${id}`);
  }

  public create(dto: AdminMovieFormDto, poster?: File | null, backdrop?: File | null): Observable<CreateResponse> {
    return this.http.post<CreateResponse>(this.apiUrl, this.toFormData(dto, poster, backdrop));
  }

  public update(id: string, dto: AdminMovieFormDto, poster?: File | null, backdrop?: File | null): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, this.toFormData(dto, poster, backdrop));
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public regenerateEmbedding(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/regenerate-embedding`, {});
  }

  private toFormData(dto: AdminMovieFormDto, poster?: File | null, backdrop?: File | null): FormData {
    const fd = new FormData();
    appendField(fd, 'key', dto.key);
    appendField(fd, 'type', dto.type);
    appendField(fd, 'status', dto.status);
    appendField(fd, 'originalTitle', dto.originalTitle);
    appendField(fd, 'originalLang', dto.originalLang);
    appendField(fd, 'imdbId', dto.imdbId);
    appendField(fd, 'tmdbId', dto.tmdbId);
    appendField(fd, 'posterUrl', dto.posterUrl);
    appendField(fd, 'backdropUrl', dto.backdropUrl);
    appendField(fd, 'trailerYoutubeId', dto.trailerYoutubeId);
    appendField(fd, 'releaseDate', dto.releaseDate);
    appendField(fd, 'runtime', dto.runtime);
    appendField(fd, 'seasonsCount', dto.seasonsCount);
    appendField(fd, 'episodesCount', dto.episodesCount);
    appendField(fd, 'isOngoing', dto.isOngoing);

    (dto.genreIds ?? []).forEach((id) => fd.append('genreIds', String(id)));

    (dto.translations ?? []).forEach((t, i) => {
      appendField(fd, `translations[${i}].languageCode`, t.languageCode);
      appendField(fd, `translations[${i}].title`, t.title);
      appendField(fd, `translations[${i}].overview`, t.overview ?? '');
      appendField(fd, `translations[${i}].tagline`, t.tagline ?? '');
    });

    if (poster) {
      fd.append('poster', poster, poster.name);
    }
    if (backdrop) {
      fd.append('backdrop', backdrop, backdrop.name);
    }
    return fd;
  }
}
