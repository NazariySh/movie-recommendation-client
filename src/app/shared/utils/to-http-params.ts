import { HttpParams } from '@angular/common/http';

type ParamValue = string | number | boolean | null | undefined;

export function toHttpParams(model: Record<string, ParamValue>): HttpParams {
  return Object.entries(model).reduce((params, [key, value]) => {
    return value !== null && value !== undefined
      ? params.set(key, String(value))
      : params;
  }, new HttpParams());
}
