import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldsModule } from '../../../../shared/components/form-fields/form-fields.module';

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
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    FormFieldsModule,
    TranslateModule,
  ],
})
export class RoleEditDialogComponent {
  public readonly controls: { role: string; control: FormControl<boolean> }[];

  public constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: RoleEditDialogData,
    private readonly ref: MatDialogRef<RoleEditDialogComponent, string[]>,
  ) {
    this.controls = data.available.map((role) => ({
      role,
      control: new FormControl<boolean>(data.roles.includes(role), { nonNullable: true }),
    }));
  }

  public save(): void {
    const selected = this.controls.filter((c) => c.control.value).map((c) => c.role);
    this.ref.close(selected);
  }

  public cancel(): void {
    this.ref.close(undefined);
  }
}
