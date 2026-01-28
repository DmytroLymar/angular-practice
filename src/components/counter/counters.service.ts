import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, skip, tap } from 'rxjs';

export type CounterItem = {
  id: number;
  count: number;
};

@Injectable({ providedIn: 'root' })
export class CountersService {
  private nextId = 1;
  private readonly STORAGE_KEY = 'counters_v1';
  private readonly destroyRef = inject(DestroyRef);

  private readonly _counters$ = new BehaviorSubject<CounterItem[]>([]);
  readonly counters$ = this._counters$.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      const loaded = this.loadFromStorage();
      this._counters$.next(loaded);
      this.nextId = this.computeNextId(loaded);

      this.counters$
        .pipe(
          skip(1),
          tap((counters) => localStorage.setItem(this.STORAGE_KEY, JSON.stringify(counters))),
        )
        .subscribe();
    }
  }

  private loadFromStorage(): CounterItem[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const countersString = localStorage.getItem(this.STORAGE_KEY);
    if (!countersString) return [];

    try {
      const data = JSON.parse(countersString);
      if (!Array.isArray(data)) return [];

      return data.map((x) => ({
        id: Number(x.id),
        count: Math.max(0, Number(x.count)),
      }));
    } catch {
      return [];
    }
  }

  private computeNextId(items: CounterItem[]): number {
    const maxId = items.reduce((m, c) => Math.max(m, c.id), 0);
    return maxId + 1;
  }

  readonly countersCount$ = this.counters$.pipe(
    map((c) => c.length),
    distinctUntilChanged(),
  );

  readonly totalCount$ = this.counters$.pipe(
    map((counters) => counters.reduce((sum, c) => sum + c.count, 0)),
    distinctUntilChanged(),
  );

  readonly hasCounters$ = this.counters$.pipe(
    map((counters) => counters.length > 0),
    distinctUntilChanged(),
  );

  addCounter(): void {
    this._counters$.next([...this._counters$.value, { id: this.nextId++, count: 0 }]);
  }

  increment(id: number): void {
    this._counters$.next(
      this._counters$.value.map((counter) =>
        counter.id === id ? { ...counter, count: counter.count + 1 } : counter,
      ),
    );
  }

  decrement(id: number): void {
    this._counters$.next(
      this._counters$.value.map((counter) =>
        counter.id === id ? { ...counter, count: Math.max(0, counter.count - 1) } : counter,
      ),
    );
  }

  reset(id: number): void {
    this._counters$.next(
      this._counters$.value.map((counter) =>
        counter.id === id ? { ...counter, count: 0 } : counter,
      ),
    );
  }

  removeCounter(id: number): void {
    this._counters$.next(this._counters$.value.filter((c) => c.id !== id));
  }

  resetAll(): void {
    this._counters$.next(this._counters$.value.map((counter) => ({ ...counter, count: 0 })));
  }

  clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this._counters$.next([]);
    this.nextId = 1;
  }
}
