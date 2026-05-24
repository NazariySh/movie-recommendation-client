import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';

export interface RoleEditDialogData {
  username: string;
  roles: string[];
  available: string[];
}

@Component({
  selector: 'app-role-edit-dialog',
  templateUrl: './role-edit-dialog.component.html',
  styleUrl: './role-edit-dialog.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    TranslateModule,
  ],
})
export class RoleEditDialogComponent {
  public selected = new Set<string>();

  public constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: RoleEditDialogData,
    private readonly ref: MatDialogRef<RoleEditDialogComponent, string[]>,
  ) {
    this.selected = new Set(data.roles);
  }

  public toggle(role: string, checked: boolean): void {
    if (checked) this.selected.add(role);
    else this.selected.delete(role);
  }

  public isChecked(role: string): boolean {
    return this.selected.has(role);
  }

  public save(): void {
    this.ref.close(Array.from(this.selected));
  }

  public cancel(): void {
    this.ref.close(undefined);
  }
}
