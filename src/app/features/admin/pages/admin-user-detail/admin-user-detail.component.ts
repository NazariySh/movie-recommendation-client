import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdminUsersService } from '../../services/admin-users.service';
import { AdminUserDetail } from '../../models/admin-models';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmActionDialogComponent } from '../../components/confirm-action-dialog/confirm-action-dialog.component';
import { RoleEditDialogComponent } from '../../components/role-edit-dialog/role-edit-dialog.component';
import { AdminPaths } from '../../../../core/constants/app-routes';
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
  public readonly usersLink = AdminPaths.USERS;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: AdminUsersService,
    private readonly toast: ToastService,
    private readonly dialog: MatDialog,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate([AdminPaths.USERS]);
      return;
    }
    this.refresh();
  }

  public refresh(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loading = true;
    this.cdr.markForCheck();
    this.api.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: u => {
          this.user = u;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
          this.toast.error('ADMIN.USERS.LOAD_FAILED');
        },
      });
  }

  public editRoles(): void {
    if (!this.user) return;
    const ref = this.dialog.open(RoleEditDialogComponent, {
      data: { username: this.user.username, roles: [...this.user.roles], available: this.availableRoles },
    });
    ref.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((roles: string[] | undefined) => {
        if (!roles || !this.user) return;
        this.api.updateRoles(this.user.id, roles)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toast.success('ADMIN.USERS.ROLES_UPDATED');
              this.refresh();
            },
            error: () => this.toast.error('ADMIN.USERS.ROLES_UPDATE_FAILED'),
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
    ref.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: { confirmed: boolean; reason?: string } | undefined) => {
        if (!result?.confirmed) return;
        const op = action === 'disable' ? this.api.disable(u.id, result.reason) : this.api.enable(u.id);
        op.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => {
            this.toast.success(action === 'disable' ? 'ADMIN.USERS.DISABLED' : 'ADMIN.USERS.ENABLED');
            this.refresh();
          },
          error: () => this.toast.error(action === 'disable' ? 'ADMIN.USERS.DISABLE_FAILED' : 'ADMIN.USERS.ENABLE_FAILED'),
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
    ref.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: { confirmed: boolean } | undefined) => {
        if (!result?.confirmed) return;
        this.api.forceResetPassword(u.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.toast.success('ADMIN.USERS.RESET_SENT'),
            error: () => this.toast.error('ADMIN.USERS.RESET_FAILED'),
          });
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
    ref.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: { confirmed: boolean } | undefined) => {
        if (!result?.confirmed) return;
        this.api.delete(u.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toast.success('ADMIN.USERS.DELETED');
              this.router.navigate([AdminPaths.USERS]);
            },
            error: () => this.toast.error('ADMIN.USERS.DELETE_FAILED'),
          });
      });
  }
}
