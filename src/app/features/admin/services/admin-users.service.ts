import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedList } from '../../../core/models/paged-list';
import {
  AdminUserDetail,
  AdminUserListItem,
  SearchAdminUsersQuery,
} from '../models/admin-models';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private readonly apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private readonly http: HttpClient) {}

  public search(query: SearchAdminUsersQuery): Observable<PagedList<AdminUserListItem>> {
    let params = new HttpParams()
      .set('pageNumber', String(query.pageNumber))
      .set('pageSize', String(query.pageSize));
    if (query.search) params = params.set('search', query.search);
    if (query.role) params = params.set('role', query.role);
    if (query.isActive !== undefined) params = params.set('isActive', String(query.isActive));
    if (query.isLocked !== undefined) params = params.set('isLocked', String(query.isLocked));
    if (query.sort) params = params.set('sort', query.sort);
    if (query.order) params = params.set('order', query.order);
    return this.http.get<PagedList<AdminUserListItem>>(this.apiUrl, { params });
  }

  public getById(id: string): Observable<AdminUserDetail> {
    return this.http.get<AdminUserDetail>(`${this.apiUrl}/${id}`);
  }

  public updateRoles(id: string, roles: string[]): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/roles`, { roles });
  }

  public disable(id: string, reason?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/disable`, { reason: reason ?? null });
  }

  public enable(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/enable`, {});
  }

  public forceResetPassword(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/force-reset-password`, {});
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
