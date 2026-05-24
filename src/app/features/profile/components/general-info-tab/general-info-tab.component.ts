import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast.service';
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
export class GeneralInfoTabComponent implements OnChanges {
  @Input() public profile: UserProfile | null = null;
  @Output() public profileUpdated = new EventEmitter<UserProfile>();

  public readonly form;
  public saving = false;
  public uploadingAvatar = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ProfileApiService,
    private readonly toast: ToastService,
    private readonly translate: TranslateService,
    private readonly cdr: ChangeDetectorRef,
  ) {
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
    if (!this.profile || this.form.invalid) return;
    this.saving = true;

    const value = this.form.getRawValue();
    this.api
      .updateMyProfile({
        username: value.username,
        bio: value.bio.trim().length === 0 ? null : value.bio,
        preferredLanguage: value.preferredLanguage,
      })
      .subscribe({
        next: (updated) => {
          this.saving = false;
          this.cdr.markForCheck();
          this.profileUpdated.emit(updated);
          this.toastKey('PROFILE.SAVED', 'success');
        },
        error: () => {
          this.saving = false;
          this.cdr.markForCheck();
          this.toastKey('PROFILE.SAVE_FAILED', 'error');
        },
      });
  }

  public onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    (event.target as HTMLInputElement).value = '';

    if (!file) return;

    if (!ALLOWED_AVATAR_MIME.includes(file.type)) {
      this.toastKey('PROFILE.AVATAR_INVALID_TYPE', 'error');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      this.toastKey('PROFILE.AVATAR_TOO_LARGE', 'error');
      return;
    }

    this.uploadingAvatar = true;
    this.api.uploadAvatar(file).subscribe({
      next: (updated) => {
        this.uploadingAvatar = false;
        this.cdr.markForCheck();
        this.profileUpdated.emit(updated);
        this.toastKey('PROFILE.AVATAR_UPDATED', 'success');
      },
      error: () => {
        this.uploadingAvatar = false;
        this.cdr.markForCheck();
        this.toastKey('PROFILE.AVATAR_UPLOAD_FAILED', 'error');
      },
    });
  }

  private toastKey(key: string, kind: 'success' | 'error'): void {
    const message = this.translate.instant(key);
    if (kind === 'success') this.toast.success(message);
    else this.toast.error(message);
  }
}
