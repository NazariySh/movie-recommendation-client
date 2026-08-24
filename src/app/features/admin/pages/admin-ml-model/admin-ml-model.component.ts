import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AdminMlService } from '../../services/admin-ml.service';
import { MlModelStatus } from '../../models/admin-models';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmActionDialogComponent } from '../../components/confirm-action-dialog/confirm-action-dialog.component';

@Component({
  selector: 'app-admin-ml-model',
  templateUrl: './admin-ml-model.component.html',
  styleUrl: './admin-ml-model.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMlModelComponent implements OnInit {
  public status: MlModelStatus | null = null;
  public loading = true;
  public retraining = false;

  public constructor(
    private readonly api: AdminMlService,
    private readonly toast: ToastService,
    private readonly dialog: MatDialog,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void { this.refresh(); }

  public refresh(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.api.getModelStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: s => { this.status = s; this.loading = false; this.cdr.markForCheck(); },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
          this.toast.error('ADMIN.ML.LOAD_FAILED');
        },
      });
  }

  public retrain(): void {
    const ref = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        titleKey: 'ADMIN.ML.RETRAIN_TITLE',
        messageKey: 'ADMIN.ML.RETRAIN_MESSAGE',
        confirmKey: 'ADMIN.ML.RETRAIN',
      },
    });
    ref.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: { confirmed: boolean } | undefined) => {
        if (!result?.confirmed) return;
        this.retraining = true;
        this.cdr.markForCheck();
        this.api.retrain(false)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toast.success('ADMIN.ML.RETRAIN_STARTED');
              this.retraining = false;
              this.cdr.markForCheck();
              setTimeout(() => this.refresh(), 1500);
            },
            error: () => {
              this.retraining = false;
              this.cdr.markForCheck();
              this.toast.error('ADMIN.ML.RETRAIN_FAILED');
            },
          });
      });
  }
}
