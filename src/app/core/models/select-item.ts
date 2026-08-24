export interface SelectItem<T = string | number> {
  value: T;
  label: string;
  icon?: string;
  disabled?: boolean;
}
