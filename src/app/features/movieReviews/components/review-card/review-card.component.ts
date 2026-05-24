import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { CreateReplyRequest, MovieReview } from '../../../../core/models/review';
import { ReviewService } from '../../services/review.service';
import { AppIcon } from '../../../../core/constants/app-icons';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCardComponent {
  @Input() public review!: MovieReview;
  @Input({ transform: booleanAttribute }) public canReply = true;
  @Input() public currentUserId: string | null = null;

  @Output() public readonly helpful = new EventEmitter<string>();
  @Output() public readonly replyCreated = new EventEmitter<string>();

  public get isOwnReview(): boolean {
    return !!this.currentUserId && this.review.userId === this.currentUserId;
  }

  public readonly AppIcon = AppIcon;
  public readonly replyControl = new FormControl('', { nonNullable: true });

  public readonly replies = signal<MovieReview[]>([]);
  public readonly repliesLoading = signal(false);
  public readonly replyFormOpen = signal(false);
  public readonly replySubmitting = signal(false);
  public readonly spoilerRevealed = signal(false);

  private readonly revealedReplies = signal<ReadonlySet<string>>(new Set());
  private repliesLoaded = false;

  constructor(
    private readonly reviewService: ReviewService,
    private readonly destroyRef: DestroyRef,
  ) {}

  public revealSpoiler(): void {
    this.spoilerRevealed.set(true);
  }

  public revealReplySpoiler(replyId: string): void {
    this.revealedReplies.update((set) => {
      const next = new Set(set);
      next.add(replyId);
      return next;
    });
  }

  public isReplySpoilerRevealed(replyId: string): boolean {
    return this.revealedReplies().has(replyId);
  }

  public toggleReplyForm(): void {
    const next = !this.replyFormOpen();
    this.replyFormOpen.set(next);
    if (next && !this.repliesLoaded && !this.repliesLoading()) {
      this.loadReplies();
    }
  }

  public onHelpful(): void {
    this.helpful.emit(this.review.id);
  }

  public submitReply(): void {
    const body = this.replyControl.value.trim();
    if (!body || this.replySubmitting()) {
      return;
    }

    this.replySubmitting.set(true);
    const request: CreateReplyRequest = { body, isSpoiler: false, score: null };

    this.reviewService
      .createReply(this.review.id, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (reply) => {
          this.replies.update((arr) => [...arr, reply]);
          this.repliesLoaded = true;
          this.replyControl.reset('');
          this.replyFormOpen.set(false);
          this.replySubmitting.set(false);
          this.replyCreated.emit(this.review.id);
        },
        error: () => this.replySubmitting.set(false),
      });
  }

  public formatCount(count: number): string {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  private loadReplies(): void {
    this.repliesLoading.set(true);
    this.reviewService
      .getReplies(this.review.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (replies) => {
          this.replies.set(replies);
          this.repliesLoaded = true;
          this.repliesLoading.set(false);
        },
        error: () => this.repliesLoading.set(false),
      });
  }
}
