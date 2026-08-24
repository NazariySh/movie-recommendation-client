import { Observable, BehaviorSubject, defer } from 'rxjs';
import { finalize } from 'rxjs/operators';

export const globalSpinner$ = new BehaviorSubject<boolean>(false);

let activeLoaders = 0;

export function wrapWithSpinner<T>(source$: Observable<T>): Observable<T> {
  return defer(() => {
    activeLoaders++;
    if (activeLoaders === 1) {
      globalSpinner$.next(true);
    }
    return source$;
  }).pipe(
    finalize(() => {
      activeLoaders = Math.max(0, activeLoaders - 1);
      if (activeLoaders === 0) {
        globalSpinner$.next(false);
      }
    })
  );
}
