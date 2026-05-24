import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedList } from '../../../core/models/paged-list';
import {
  CreateMovieReviewRequest,
  CreateReplyRequest,
  MovieReview,
  ReviewSort,
  ToggleHelpfulResult,
  UpdateMovieReviewRequest,
} from '../../../core/models/review';
import { toHttpParams } from '../../../shared/utils/to-http-params';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  public getReviews(
    movieId: string,
    sort: ReviewSort,
    pageNumber: number,
    pageSize: number,
  ): Observable<PagedList<MovieReview>> {
    const params = toHttpParams({ sort, pageNumber, pageSize });
    return this.http.get<PagedList<MovieReview>>(
      `${this.apiUrl}/movies/${movieId}/reviews`,
      { params },
    );
  }

  public getReplies(reviewId: string): Observable<MovieReview[]> {
    return this.http.get<MovieReview[]>(`${this.apiUrl}/reviews/${reviewId}/comments`);
  }

  public createReview(movieId: string, request: CreateMovieReviewRequest): Observable<MovieReview> {
    return this.http.post<MovieReview>(`${this.apiUrl}/movies/${movieId}/reviews`, request);
  }

  public createReply(reviewId: string, request: CreateReplyRequest): Observable<MovieReview> {
    return this.http.post<MovieReview>(`${this.apiUrl}/reviews/${reviewId}/comments`, request);
  }

  public updateReview(reviewId: string, request: UpdateMovieReviewRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reviews/${reviewId}`, request);
  }

  public deleteReview(reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${reviewId}`);
  }

  public toggleHelpful(reviewId: string): Observable<ToggleHelpfulResult> {
    return this.http.post<ToggleHelpfulResult>(`${this.apiUrl}/reviews/${reviewId}/helpful`, {});
  }
}
