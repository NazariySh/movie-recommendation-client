import { HttpErrorResponse } from '@angular/common/http';

export interface ServerValidationErrors {
  fieldErrors: Record<string, string>;
  general: string | null;
}

export function parseServerErrors(
  err: HttpErrorResponse,
  formKeys: readonly string[]
): ServerValidationErrors {
  const result: ServerValidationErrors = { fieldErrors: {}, general: null };
  const body = err.error;

  if (!body || typeof body !== 'object') return result;

  if (body.errors && typeof body.errors === 'object') {
    const orphans: string[] = [];
    for (const [key, value] of Object.entries(body.errors as Record<string, unknown>)) {
      const camel = toCamelCase(key);
      const message = Array.isArray(value) ? String(value[0]) : String(value);
      if (formKeys.includes(camel)) {
        result.fieldErrors[camel] = message;
      } else {
        orphans.push(message);
      }
    }
    if (orphans.length > 0) {
      result.general = orphans.join(' ');
    }
    return result;
  }

  const detail = (body.detail as string | undefined) ?? (body.title as string | undefined);
  if (detail) {
    result.general = detail;
  }
  return result;
}

function toCamelCase(key: string): string {
  if (!key) return key;
  return key.charAt(0).toLowerCase() + key.slice(1);
}
