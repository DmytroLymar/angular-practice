import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  of,
  skip,
  tap,
} from 'rxjs';
import { CountersApiService } from './counters-api.service';

export type CounterItem = {
  id: number;
  count: number;
};

@Injectable({ providedIn: 'root' })
export class CountersService {
  private readonly STORAGE_KEY = 'counters_v1';

  private readonly _counters$ = new BehaviorSubject<CounterItem[]>([]);
  readonly counters$ = this._counters$.asObservable();

  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _error$ = new BehaviorSubject<string | null>(null);
  readonly error$ = this._error$.asObservable();

  constructor(private api: CountersApiService) {}

  load(opts?: { fail?: boolean }): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.api
      .getCounters(opts)
      .pipe(
        catchError((err) => {
          this._error$.next(err?.error?.message ?? 'Unknown error');
          return of([] as CounterItem[]);
        }),
        finalize(() => this._loading$.next(false)),
      )
      .subscribe((items) => this._counters$.next(items));
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
    this._loading$.next(true);
    this._error$.next(null);

    this.api
      .addCounter()
      .pipe(
        catchError((err) => {
          this._error$.next(err?.error?.message ?? 'Unknown error');
          return of(null);
        }),
        finalize(() => this._loading$.next(false)),
      )
      .subscribe((created) => {
        if (!created) return;
        this._counters$.next([...this._counters$.value, created]);
      });
  }

  increment(id: number): void {
    const current = this._counters$.value.find((c) => c.id === id);
    if (!current) return;

    this.updateCount(id, current.count + 1);
  }

  decrement(id: number): void {
    const current = this._counters$.value.find((c) => c.id === id);
    if (!current) return;

    this.updateCount(id, Math.max(0, current.count - 1));
  }

  reset(id: number): void {
    this.updateCount(id, 0);
  }

  private updateCount(id: number, count: number): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.api
      .updateCount(id, count)
      .pipe(
        catchError((err) => {
          this._error$.next(err?.error?.message ?? 'Unknown error');
          return of(null);
        }),
        finalize(() => this._loading$.next(false)),
      )
      .subscribe((updated) => {
        if (!updated) return;
        this._counters$.next(this._counters$.value.map((c) => (c.id === id ? updated : c)));
      });
  }

  removeCounter(id: number): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.api
      .removeCounter(id)
      .pipe(
        catchError((err) => {
          this._error$.next(err?.error?.message ?? 'Unknown error');
          return of(null);
        }),
        finalize(() => this._loading$.next(false)),
      )
      .subscribe((res) => {
        if (!res) return;
        this._counters$.next(this._counters$.value.filter((c) => c.id !== id));
      });
  }

  resetAll(): void {
    this._counters$.next(this._counters$.value.map((counter) => ({ ...counter, count: 0 })));
  }

  clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this._counters$.next([]);
  }
}
