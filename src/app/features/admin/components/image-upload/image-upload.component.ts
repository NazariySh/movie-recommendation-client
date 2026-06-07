import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast.service';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

export type ImageUploadAspect = 'poster' | 'backdrop' | 'square';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent implements OnDestroy {
  @Input() public control: AbstractControl | null = null;
  @Input() public label = '';
  @Input() public hint = '';
  @Input() public aspect: ImageUploadAspect = 'poster';
  @Output() public readonly fileChange = new EventEmitter<File | null>();

  public previewUrl: string | null = null;
  public fileName: string | null = null;

  public constructor(
    private readonly toast: ToastService,
    private readonly translate: TranslateService,
  ) {}

  public get displaySrc(): string | null {
    if (this.previewUrl) {
      return this.previewUrl;
    }
    const value = this.control?.value as string | null | undefined;
    return value && value.length > 0 ? value : null;
  }

  public get hasImage(): boolean {
    return this.displaySrc !== null;
  }

  public onSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (!file) {
      return;
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      this.toast.error(this.translate.instant('ADMIN.UPLOAD.INVALID_TYPE'));
      return;
    }
    if (file.size > MAX_BYTES) {
      this.toast.error(this.translate.instant('ADMIN.UPLOAD.TOO_LARGE'));
      return;
    }

    this.revokePreview();
    this.previewUrl = URL.createObjectURL(file);
    this.fileName = file.name;
    this.control?.markAsDirty();
    this.fileChange.emit(file);
  }

  public remove(): void {
    this.revokePreview();
    this.fileName = null;
    this.control?.setValue('');
    this.control?.markAsDirty();
    this.fileChange.emit(null);
  }

  public ngOnDestroy(): void {
    this.revokePreview();
  }

  private revokePreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }
}
