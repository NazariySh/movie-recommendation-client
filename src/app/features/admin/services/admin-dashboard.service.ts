import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardActivity, DashboardSummary } from '../models/admin-models';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private readonly apiUrl = `${environment.apiUrl}/admin/dashboard`;

  constructor(private readonly http: HttpClient) {}

  public getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  public getActivity(days: number): Observable<DashboardActivity> {
    const params = new HttpParams().set('days', String(days));
    return this.http.get<DashboardActivity>(`${this.apiUrl}/activity`, { params });
  }
}
