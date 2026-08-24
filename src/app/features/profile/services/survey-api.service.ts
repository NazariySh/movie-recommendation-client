import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SubmitSurveyPayload, Survey, SurveyResponse } from '../models/survey.model';

@Injectable({ providedIn: 'root' })
export class SurveyApiService {
  private readonly baseUrl = `${environment.apiUrl}/surveys`;

  constructor(private readonly http: HttpClient) {}

  public getCurrent(): Observable<Survey> {
    return this.http.get<Survey>(`${this.baseUrl}/current`);
  }

  public submit(payload: SubmitSurveyPayload): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/responses`, payload);
  }

  public getMyLatest(): Observable<SurveyResponse | null> {
    return this.http.get<SurveyResponse | null>(`${this.baseUrl}/my-response`);
  }
}
