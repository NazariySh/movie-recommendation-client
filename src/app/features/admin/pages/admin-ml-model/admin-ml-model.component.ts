import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void { this.refresh(); }

  public refresh(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.api.getModelStatus().subscribe({
      next: s => { this.status = s; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
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
    ref.afterClosed().subscribe((result: { confirmed: boolean } | undefined) => {
      if (!result?.confirmed) return;
      this.retraining = true;
      this.cdr.markForCheck();
      this.api.retrain(false).subscribe({
        next: () => {
          this.toast.success('ADMIN.ML.RETRAIN_STARTED');
          this.retraining = false;
          this.cdr.markForCheck();
          setTimeout(() => this.refresh(), 1500);
        },
        error: () => { this.retraining = false; this.cdr.markForCheck(); },
      });
    });
  }
}
