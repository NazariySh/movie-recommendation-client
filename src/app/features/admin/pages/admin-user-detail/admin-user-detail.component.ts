import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdminUsersService } from '../../services/admin-users.service';
import { AdminUserDetail } from '../../models/admin-models';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmActionDialogComponent } from '../../components/confirm-action-dialog/confirm-action-dialog.component';
import { RoleEditDialogComponent } from '../../components/role-edit-dialog/role-edit-dialog.component';
import { ADMIN_AVAILABLE_ROLES, ADMIN_DELETE_TYPED_CONFIRMATION } from '../../admin.constants';

@Component({
  selector: 'app-admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
  styleUrl: './admin-user-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserDetailComponent implements OnInit {
  public user: AdminUserDetail | null = null;
  public loading = true;
  public readonly availableRoles = ADMIN_AVAILABLE_ROLES;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: AdminUsersService,
    private readonly toast: ToastService,
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.refresh();
  }

  public refresh(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loading = true;
    this.cdr.markForCheck();
    this.api.getById(id).subscribe(u => {
      this.user = u;
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  public editRoles(): void {
    if (!this.user) return;
    const ref = this.dialog.open(RoleEditDialogComponent, {
      data: { username: this.user.username, roles: [...this.user.roles], available: this.availableRoles },
    });
    ref.afterClosed().subscribe((roles: string[] | undefined) => {
      if (!roles || !this.user) return;
      this.api.updateRoles(this.user.id, roles).subscribe(() => {
        this.toast.success('ADMIN.USERS.ROLES_UPDATED');
        this.refresh();
      });
    });
  }

  public toggleActive(): void {
    if (!this.user) return;
    const u = this.user;
    const action = u.isActive ? 'disable' : 'enable';
    const ref = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        titleKey: action === 'disable' ? 'ADMIN.USERS.DISABLE_TITLE' : 'ADMIN.USERS.ENABLE_TITLE',
        messageKey: action === 'disable' ? 'ADMIN.USERS.DISABLE_MESSAGE' : 'ADMIN.USERS.ENABLE_MESSAGE',
        messageParams: { name: u.username },
        promptForReason: action === 'disable',
        confirmKey: action === 'disable' ? 'ADMIN.USERS.DISABLE' : 'ADMIN.USERS.ENABLE',
        destructive: action === 'disable',
      },
    });
    ref.afterClosed().subscribe((result: { confirmed: boolean; reason?: string } | undefined) => {
      if (!result?.confirmed) return;
      const op = action === 'disable' ? this.api.disable(u.id, result.reason) : this.api.enable(u.id);
      op.subscribe(() => {
        this.toast.success(action === 'disable' ? 'ADMIN.USERS.DISABLED' : 'ADMIN.USERS.ENABLED');
        this.refresh();
      });
    });
  }

  public forceReset(): void {
    if (!this.user) return;
    const u = this.user;
    const ref = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        titleKey: 'ADMIN.USERS.FORCE_RESET_TITLE',
        messageKey: 'ADMIN.USERS.FORCE_RESET_MESSAGE',
        messageParams: { name: u.username },
        confirmKey: 'ADMIN.USERS.FORCE_RESET',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((result: { confirmed: boolean } | undefined) => {
      if (!result?.confirmed) return;
      this.api.forceResetPassword(u.id).subscribe(() => this.toast.success('ADMIN.USERS.RESET_SENT'));
    });
  }

  public deleteUser(): void {
    if (!this.user) return;
    const u = this.user;
    const ref = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        titleKey: 'ADMIN.USERS.DELETE_TITLE',
        messageKey: 'ADMIN.USERS.DELETE_MESSAGE',
        messageParams: { name: u.username },
        requireTypedConfirmation: ADMIN_DELETE_TYPED_CONFIRMATION,
        confirmKey: 'COMMON.DELETE',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((result: { confirmed: boolean } | undefined) => {
      if (!result?.confirmed) return;
      this.api.delete(u.id).subscribe(() => {
        this.toast.success('ADMIN.USERS.DELETED');
        this.router.navigate(['/admin/users']);
      });
    });
  }
}
