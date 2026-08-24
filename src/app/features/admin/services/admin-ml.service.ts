import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MlModelStatus } from '../models/admin-models';

@Injectable({ providedIn: 'root' })
export class AdminMlService {
  private readonly apiUrl = `${environment.apiUrl}/admin/recommendations`;

  constructor(private readonly http: HttpClient) {}

  public getModelStatus(): Observable<MlModelStatus> {
    return this.http.get<MlModelStatus>(`${this.apiUrl}/model-status`);
  }

  public retrain(wait = false): Observable<unknown> {
    const params = new HttpParams().set('wait', String(wait));
    return this.http.post<unknown>(`${this.apiUrl}/retrain`, {}, { params });
  }
}
