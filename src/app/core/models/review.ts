export type ReviewSort = 'hottest' | 'newest' | 'oldest';

export interface MovieReview {
  id: string;
  movieId: string;
  userId: string;
  parentReviewId: string | null;
  authorName: string;
  authorAvatarUrl: string | null;
  body: string;
  isSpoiler: boolean;
  score: number | null;
  helpfulCount: number;
  markedHelpful: boolean;
  replyCount: number;
  replyToUserName: string | null;
  createdAt: string;
}

export interface CreateMovieReviewRequest {
  body: string;
  isSpoiler: boolean;
  score: number | null;
}

export interface CreateReplyRequest {
  body: string;
  isSpoiler: boolean;
  score: number | null;
  parentReplyId?: string | null;
}

export interface UpdateMovieReviewRequest {
  body: string;
  isSpoiler: boolean;
  score: number | null;
}

export interface ToggleHelpfulResult {
  helpfulCount: number;
  markedHelpful: boolean;
}
