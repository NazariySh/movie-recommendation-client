import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  private readonly _drawerOpen$ = new BehaviorSubject<boolean>(false);
  public readonly drawerOpen$ = this._drawerOpen$.asObservable();

  public get isOpen(): boolean {
    return this._drawerOpen$.value;
  }

  public open(): void {
    if (!this._drawerOpen$.value) this._drawerOpen$.next(true);
  }

  public close(): void {
    if (this._drawerOpen$.value) this._drawerOpen$.next(false);
  }

  public toggle(): void {
    this._drawerOpen$.next(!this._drawerOpen$.value);
  }
}
