import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  GenrePreference,
  PublicProfile,
  UpdateGenrePreferencePayload,
  UpdateProfilePayload,
  UserProfile,
  UserStats,
} from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private readonly http: HttpClient) {}

  public getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/me`);
  }

  public updateMyProfile(payload: UpdateProfilePayload): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/me`, payload);
  }

  public uploadAvatar(file: File): Observable<UserProfile> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<UserProfile>(`${this.baseUrl}/me/avatar`, form);
  }

  public getMyStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.baseUrl}/me/stats`);
  }

  public getMyGenrePreferences(): Observable<GenrePreference[]> {
    return this.http.get<GenrePreference[]>(`${this.baseUrl}/me/genre-preferences`);
  }

  public updateGenrePreferences(payload: UpdateGenrePreferencePayload[]): Observable<GenrePreference[]> {
    return this.http.put<GenrePreference[]>(`${this.baseUrl}/me/genre-preferences`, payload);
  }

  public getPublicProfile(userId: string): Observable<PublicProfile> {
    return this.http.get<PublicProfile>(`${this.baseUrl}/${userId}/public`);
  }
}
