import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppIcon } from '../../../../core/constants/app-icons';

export interface TrailerDialogData {
  youtubeId: string;
  title: string;
}

@Component({
  selector: 'app-trailer-dialog',
  templateUrl: './trailer-dialog.component.html',
  styleUrl: './trailer-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailerDialogComponent {
  public readonly AppIcon = AppIcon;
  public readonly trailerUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: TrailerDialogData,
    private readonly dialogRef: MatDialogRef<TrailerDialogComponent>,
    sanitizer: DomSanitizer,
  ) {
    this.trailerUrl = sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${data.youtubeId}?autoplay=1&rel=0`,
    );
  }

  public close(): void {
    this.dialogRef.close();
  }
}
