import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppIcon } from '../../../../core/constants/app-icons';
import { CreateMovieReviewRequest } from '../../../../core/models/review';

const BODY_MIN_LENGTH = 10;

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent implements OnInit {
  @Input() public movieId!: string;
  @Input() public submitting = false;
  @Output() public readonly submitted = new EventEmitter<CreateMovieReviewRequest>();

  public readonly AppIcon = AppIcon;
  public readonly bodyMinLength = BODY_MIN_LENGTH;
  public form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  public ngOnInit(): void {
    this.form = this.fb.group({
      body: ['', [Validators.required, Validators.minLength(BODY_MIN_LENGTH)]],
      score: [5],
      isSpoiler: [false],
    });
  }

  public submit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitted.emit({
      body: (this.form.value.body as string).trim(),
      score: (this.form.value.score as number) ?? null,
      isSpoiler: this.form.value.isSpoiler as boolean,
    });
  }

  // Called by the parent after a successful HTTP response so the user keeps
  // their text on failure but the form clears on success.
  public reset(): void {
    this.form.reset({ body: '', score: 5, isSpoiler: false });
  }

  public get scoreValue(): number {
    return (this.form.get('score')?.value as number) ?? 5;
  }

  public get bodyTooShort(): boolean {
    const ctrl = this.form.get('body');
    return !!(ctrl && ctrl.dirty && ctrl.hasError('minlength'));
  }
}
