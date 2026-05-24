import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private activeRequests = 0;
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  public show(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this._loading$.next(true);
    }
  }

  public hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this._loading$.next(false);
    }
  }
}
