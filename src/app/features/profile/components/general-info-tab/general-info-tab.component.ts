import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SelectItem } from '../../../../core/models/select-item';
import { FormComponent } from '../../../../shared/form/form-component';
import { UserProfile } from '../../models/profile.model';
import { ProfileApiService } from '../../services/profile-api.service';

const ALLOWED_AVATAR_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

@Component({
  selector: 'app-general-info-tab',
  templateUrl: './general-info-tab.component.html',
  styleUrl: './general-info-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInfoTabComponent extends FormComponent implements OnChanges {
  @Input() public profile: UserProfile | null = null;
  @Output() public profileUpdated = new EventEmitter<UserProfile>();

  public readonly form: FormGroup;
  public readonly languageOptions: SelectItem[] = [
    { value: 'uk', label: 'LANGUAGE.UK' },
    { value: 'en', label: 'LANGUAGE.EN' },
  ];

  public saving = false;
  public uploadingAvatar = false;

  public constructor(
    private readonly fb: FormBuilder,
    private readonly api: ProfileApiService,
    private readonly destroyRef: DestroyRef,
  ) {
    super();
    this.form = this.fb.nonNullable.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      bio: ['', [Validators.maxLength(500)]],
      preferredLanguage: ['uk', Validators.required],
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile'] && this.profile) {
      this.form.reset({
        username: this.profile.username,
        bio: this.profile.bio ?? '',
        preferredLanguage: this.profile.preferredLanguage,
      });
    }
  }

  public onSubmit(): void {
    if (!this.profile || this.saving || this.form.invalid) return;
    this.saving = true;
    this.form.disable();
    this.cdr.markForCheck();

    const value = this.form.getRawValue();
    this.api
      .updateMyProfile({
        username: value.username,
        bio: value.bio.trim().length === 0 ? null : value.bio,
        preferredLanguage: value.preferredLanguage,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.handleValidationError(err);
          if (err.status !== 400 && err.status !== 422) {
            this.toast.error(this.translate.instant('PROFILE.SAVE_FAILED'));
          }
          return EMPTY;
        }),
        finalize(() => {
          this.saving = false;
          this.form.enable();
          this.cdr.markForCheck();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((updated) => {
        this.profileUpdated.emit(updated);
        this.toast.success(this.translate.instant('PROFILE.SAVED'));
      });
  }

  public onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file || this.uploadingAvatar) return;

    if (!ALLOWED_AVATAR_MIME.includes(file.type)) {
      this.toast.error(this.translate.instant('PROFILE.AVATAR_INVALID_TYPE'));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      this.toast.error(this.translate.instant('PROFILE.AVATAR_TOO_LARGE'));
      return;
    }

    this.uploadingAvatar = true;
    this.cdr.markForCheck();

    this.api
      .uploadAvatar(file)
      .pipe(
        catchError(() => {
          this.toast.error(this.translate.instant('PROFILE.AVATAR_UPLOAD_FAILED'));
          return EMPTY;
        }),
        finalize(() => {
          this.uploadingAvatar = false;
          this.cdr.markForCheck();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((updated) => {
        this.profileUpdated.emit(updated);
        this.toast.success(this.translate.instant('PROFILE.AVATAR_UPDATED'));
      });
  }
}
