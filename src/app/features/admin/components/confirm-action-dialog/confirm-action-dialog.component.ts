import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormFieldsModule } from '../../../../shared/components/form-fields/form-fields.module';

export interface ConfirmActionDialogData {
  titleKey: string;
  messageKey: string;
  messageParams?: Record<string, unknown>;
  confirmKey?: string;
  cancelKey?: string;
  destructive?: boolean;
  promptForReason?: boolean;
  requireTypedConfirmation?: string;
}

export interface ConfirmActionDialogResult {
  confirmed: boolean;
  reason?: string;
}

@Component({
  selector: 'app-confirm-action-dialog',
  templateUrl: './confirm-action-dialog.component.html',
  styleUrl: './confirm-action-dialog.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    FormFieldsModule,
  ],
})
export class ConfirmActionDialogComponent {
  public readonly reason = new FormControl<string>('', { nonNullable: true });
  public readonly typed = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] });

  public constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: ConfirmActionDialogData,
    private readonly ref: MatDialogRef<ConfirmActionDialogComponent, ConfirmActionDialogResult>,
    private readonly translate: TranslateService,
  ) {}

  public get canConfirm(): boolean {
    if (this.data.requireTypedConfirmation) {
      return this.typed.value.trim() === this.data.requireTypedConfirmation;
    }
    return true;
  }

  public get typedConfirmationLabel(): string {
    return this.translate.instant('COMMON.TYPE_TO_CONFIRM', { word: this.data.requireTypedConfirmation ?? '' });
  }

  public confirm(): void {
    if (!this.canConfirm) return;
    this.ref.close({ confirmed: true, reason: this.reason.value || undefined });
  }

  public cancel(): void {
    this.ref.close({ confirmed: false });
  }
}
