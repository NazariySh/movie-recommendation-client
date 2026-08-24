export function appendField(
  form: FormData,
  key: string,
  value: string | number | boolean | null | undefined,
): void {
  if (value === null || value === undefined) {
    return;
  }
  form.append(key, String(value));
}
