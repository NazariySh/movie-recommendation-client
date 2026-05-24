import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';
import { AdminUsersService } from '../../services/admin-users.service';
import { AdminUserListItem, SearchAdminUsersQuery } from '../../models/admin-models';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmActionDialogComponent } from '../../components/confirm-action-dialog/confirm-action-dialog.component';
import { RoleEditDialogComponent } from '../../components/role-edit-dialog/role-edit-dialog.component';
import {
  ADMIN_AVAILABLE_ROLES,
  ADMIN_DEFAULT_PAGE_SIZE,
  ADMIN_DELETE_TYPED_CONFIRMATION,
  ADMIN_FILTER_DEBOUNCE_MS,
  ADMIN_PAGE_SIZE_OPTIONS,
} from '../../admin.constants';

type StatusFilter = 'any' | 'active' | 'inactive' | 'locked';

interface ListState {
  search: string;
  role: string;
  status: StatusFilter;
  pageNumber: number;
  pageSize: number;
}

const INITIAL_STATE: ListState = {
  search: '',
  role: '',
  status: 'any',
  pageNumber: 1,
  pageSize: ADMIN_DEFAULT_PAGE_SIZE,
};

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrl: './admin-users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersListComponent implements OnInit {
  private readonly state$ = new BehaviorSubject<ListState>(INITIAL_STATE);

  public readonly displayedColumns = ['avatar', 'username', 'email', 'roles', 'status', 'createdAt', 'actions'];
  public readonly availableRoles = ADMIN_AVAILABLE_ROLES;
  public readonly pageSizeOptions = ADMIN_PAGE_SIZE_OPTIONS;
  public readonly searchControl = new FormControl(INITIAL_STATE.search, { nonNullable: true });

  public users: AdminUserListItem[] = [];
  public totalCount = 0;
  public loading = true;

  public constructor(
    private readonly api: AdminUsersService,
    private readonly toast: ToastService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public get state(): ListState {
    return this.state$.value;
  }

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(ADMIN_FILTER_DEBOUNCE_MS), takeUntilDestroyed(this.destroyRef))
      .subscribe((search) => this.patchState({ search, pageNumber: 1 }));

    this.state$
      .pipe(
        switchMap((state) => {
          this.loading = true;
          this.cdr.markForCheck();
          return this.api.search(this.toQuery(state));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (page) => {
          this.users = page.items;
          this.totalCount = page.totalCount;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  public onRoleChange(role: string): void {
    this.patchState({ role, pageNumber: 1 });
  }

  public onStatusChange(status: StatusFilter): void {
    this.patchState({ status, pageNumber: 1 });
  }

  public onPage(pageEvent: { pageIndex: number; pageSize: number }): void {
    this.patchState({ pageNumber: pageEvent.pageIndex + 1, pageSize: pageEvent.pageSize });
  }

  public openDetail(user: AdminUserListItem): void {
    this.router.navigate(['/admin/users', user.id]);
  }

  public editRoles(user: AdminUserListItem): void {
    const ref = this.dialog.open(RoleEditDialogComponent, {
      data: { username: user.username, roles: [...user.roles], available: this.availableRoles },
    });
    ref.afterClosed().subscribe((roles: string[] | undefined) => {
      if (!roles) return;
      this.api.updateRoles(user.id, roles).subscribe(() => {
        this.toast.success('ADMIN.USERS.ROLES_UPDATED');
        this.reload();
      });
    });
  }

  public toggleActive(user: AdminUserListItem): void {
    const action = user.isActive ? 'disable' : 'enable';
    const ref = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        titleKey: action === 'disable' ? 'ADMIN.USERS.DISABLE_TITLE' : 'ADMIN.USERS.ENABLE_TITLE',
        messageKey: action === 'disable' ? 'ADMIN.USERS.DISABLE_MESSAGE' : 'ADMIN.USERS.ENABLE_MESSAGE',
        messageParams: { name: user.username },
        promptForReason: action === 'disable',
        confirmKey: action === 'disable' ? 'ADMIN.USERS.DISABLE' : 'ADMIN.USERS.ENABLE',
        destructive: action === 'disable',
      },
    });
    ref.afterClosed().subscribe((result: { confirmed: boolean; reason?: string } | undefined) => {
      if (!result?.confirmed) return;
      const op = action === 'disable'
        ? this.api.disable(user.id, result.reason)
        : this.api.enable(user.id);
      op.subscribe(() => {
        this.toast.success(action === 'disable' ? 'ADMIN.USERS.DISABLED' : 'ADMIN.USERS.ENABLED');
        this.reload();
      });
    });
  }

  public forceReset(user: AdminUserListItem): void {
    const ref = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        titleKey: 'ADMIN.USERS.FORCE_RESET_TITLE',
        messageKey: 'ADMIN.USERS.FORCE_RESET_MESSAGE',
        messageParams: { name: user.username },
        confirmKey: 'ADMIN.USERS.FORCE_RESET',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((result: { confirmed: boolean } | undefined) => {
      if (!result?.confirmed) return;
      this.api.forceResetPassword(user.id).subscribe(() => {
        this.toast.success('ADMIN.USERS.RESET_SENT');
      });
    });
  }

  public delete(user: AdminUserListItem): void {
    const ref = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        titleKey: 'ADMIN.USERS.DELETE_TITLE',
        messageKey: 'ADMIN.USERS.DELETE_MESSAGE',
        messageParams: { name: user.username },
        requireTypedConfirmation: ADMIN_DELETE_TYPED_CONFIRMATION,
        confirmKey: 'COMMON.DELETE',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((result: { confirmed: boolean } | undefined) => {
      if (!result?.confirmed) return;
      this.api.delete(user.id).subscribe(() => {
        this.toast.success('ADMIN.USERS.DELETED');
        this.reload();
      });
    });
  }

  private patchState(partial: Partial<ListState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }

  private reload(): void {
    this.state$.next({ ...this.state$.value });
  }

  private toQuery(state: ListState): SearchAdminUsersQuery {
    const query: SearchAdminUsersQuery = {
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
    };
    const trimmed = state.search.trim();
    if (trimmed) query.search = trimmed;
    if (state.role) query.role = state.role;
    if (state.status === 'active') query.isActive = true;
    if (state.status === 'inactive') query.isActive = false;
    if (state.status === 'locked') query.isLocked = true;
    return query;
  }
}
