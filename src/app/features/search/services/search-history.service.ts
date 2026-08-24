import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
  private static readonly STORAGE_KEY = 'mm:recent-searches';
  private static readonly MAX_ENTRIES = 10;

  private readonly _entries$ = new BehaviorSubject<string[]>(this.read());
  public readonly entries$ = this._entries$.asObservable();

  public add(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;

    const next = [trimmed, ...this._entries$.value.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())]
      .slice(0, SearchHistoryService.MAX_ENTRIES);

    this.write(next);
  }

  public remove(query: string): void {
    const next = this._entries$.value.filter((q) => q !== query);
    this.write(next);
  }

  public clear(): void {
    this.write([]);
  }

  public snapshot(): string[] {
    return [...this._entries$.value];
  }

  private read(): string[] {
    try {
      const raw = localStorage.getItem(SearchHistoryService.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }

  private write(entries: string[]): void {
    try {
      localStorage.setItem(SearchHistoryService.STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      void e;
    }
    this._entries$.next(entries);
  }
}
