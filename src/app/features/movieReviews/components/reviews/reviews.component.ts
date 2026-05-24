import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Input,
  OnInit,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import {
  CreateMovieReviewRequest,
  MovieReview,
  ReviewSort,
} from '../../../../core/models/review';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AppIcon } from '../../../../core/constants/app-icons';
import { AuthPaths } from '../../../../core/constants/app-routes';
import { ReviewFormComponent } from '../review-form/review-form.component';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsComponent implements OnInit {
  @Input() public movieId!: string;

  @ViewChild(ReviewFormComponent) private reviewForm?: ReviewFormComponent;

  public readonly AppIcon = AppIcon;
  public readonly PAGE_SIZE = 10;
  public readonly loginPath = AuthPaths.LOGIN;

  public readonly sorts: { id: ReviewSort; labelKey: string }[] = [
    { id: 'newest', labelKey: 'REVIEWS.SORT.NEWEST' },
    { id: 'oldest', labelKey: 'REVIEWS.SORT.OLDEST' },
    { id: 'hottest', labelKey: 'REVIEWS.SORT.HOTTEST' },
  ];

  public readonly sortControl = new FormControl<ReviewSort>('hottest', { nonNullable: true });

  public readonly reviews = signal<MovieReview[]>([]);
  public readonly total = signal(0);
  public readonly loading = signal(false);
  public readonly error = signal(false);
  public readonly submitting = signal(false);
  public readonly hasMore = computed(() => this.reviews().length < this.total());
  public readonly isAuthenticated: Signal<boolean>;
  public readonly currentUserId: Signal<string | null>;

  private currentPage = 1;

  constructor(
    private readonly reviewService: ReviewService,
    private readonly authService: AuthService,
    private readonly toast: ToastService,
    private readonly destroyRef: DestroyRef,
  ) {
    this.isAuthenticated = toSignal(this.authService.isAuthenticated$, { initialValue: false });
    this.currentUserId = toSignal(
      this.authService.user$.pipe(map((u) => u?.id ?? null)),
      { initialValue: null },
    );
  }

  public ngOnInit(): void {
    this.sortControl.valueChanges
      .pipe(startWith(this.sortControl.value), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.load(true));
  }

  public setSort(sort: ReviewSort): void {
    if (sort === this.sortControl.value) {
      return;
    }
    this.sortControl.setValue(sort);
  }

  public loadMore(): void {
    if (this.loading() || !this.hasMore()) {
      return;
    }
    this.currentPage++;
    this.load(false);
  }

  public retry(): void {
    this.load(true);
  }

  public formatTotal(): string {
    const t = this.total();
    return t >= 1000 ? (t / 1000).toFixed(1) + 'K' : String(t);
  }

  public onSubmit(request: CreateMovieReviewRequest): void {
    this.submitting.set(true);
    this.reviewService
      .createReview(this.movieId, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (review) => {
          this.reviews.update((arr) => [review, ...arr]);
          this.total.update((t) => t + 1);
          this.submitting.set(false);
          this.reviewForm?.reset();
          this.toast.success('REVIEWS.SUBMITTED');
        },
        error: (err: { status?: number }) => {
          this.submitting.set(false);
          if (err?.status !== 401 && err?.status !== 403 && err?.status !== 429) {
            this.toast.error('REVIEWS.SUBMIT_FAILED');
          }
        },
      });
  }

  public onHelpful(reviewId: string): void {
    this.reviewService
      .toggleHelpful(reviewId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.reviews.update((arr) =>
            arr.map((r) =>
              r.id === reviewId
                ? { ...r, helpfulCount: result.helpfulCount, markedHelpful: result.markedHelpful }
                : r,
            ),
          );
        },
      });
  }

  public onReplyCreated(parentId: string): void {
    this.reviews.update((arr) =>
      arr.map((r) => (r.id === parentId ? { ...r, replyCount: r.replyCount + 1 } : r)),
    );
  }

  private load(reset: boolean): void {
    if (reset) {
      this.currentPage = 1;
    }
    this.loading.set(true);
    this.error.set(false);

    this.reviewService
      .getReviews(this.movieId, this.sortControl.value, this.currentPage, this.PAGE_SIZE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.reviews.update((arr) => (reset ? page.items : [...arr, ...page.items]));
          this.total.set(page.totalCount);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
