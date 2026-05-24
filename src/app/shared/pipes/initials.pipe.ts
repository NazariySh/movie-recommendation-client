import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  public transform(value: string | null | undefined, maxChars = 2): string {
    if (!value) return '';
    return value
      .split(' ')
      .filter(Boolean)
      .slice(0, maxChars)
      .map(w => w.charAt(0).toUpperCase())
      .join('');
  }
}
