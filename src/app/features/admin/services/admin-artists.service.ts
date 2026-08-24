import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminArtistFormDto } from '../models/admin-models';
import { appendField } from './admin-form-data';

interface CreateResponse {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class AdminArtistsService {
  private readonly apiUrl = `${environment.apiUrl}/admin/artists`;

  constructor(private readonly http: HttpClient) {}

  public create(dto: AdminArtistFormDto, photo?: File | null): Observable<CreateResponse> {
    return this.http.post<CreateResponse>(this.apiUrl, this.toFormData(dto, photo));
  }

  public update(id: string, dto: AdminArtistFormDto, photo?: File | null): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, this.toFormData(dto, photo));
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private toFormData(dto: AdminArtistFormDto, photo?: File | null): FormData {
    const fd = new FormData();
    appendField(fd, 'name', dto.name);
    appendField(fd, 'photoUrl', dto.photoUrl);
    appendField(fd, 'imdbId', dto.imdbId);
    appendField(fd, 'tmdbId', dto.tmdbId);
    appendField(fd, 'birthday', dto.birthday);
    appendField(fd, 'dateOfDeath', dto.dateOfDeath);
    appendField(fd, 'placeOfBirth', dto.placeOfBirth);
    appendField(fd, 'nationality', dto.nationality);
    appendField(fd, 'gender', dto.gender);
    appendField(fd, 'knownForDepartment', dto.knownForDepartment);
    appendField(fd, 'biography', dto.biography);
    if (photo) {
      fd.append('photo', photo, photo.name);
    }
    return fd;
  }
}
