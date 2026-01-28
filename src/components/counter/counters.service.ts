import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

export type CounterItem = {
  id: number;
  count: number;
};

@Injectable({ providedIn: 'root' })
export class CountersService {
  private nextId = 1;
  private readonly _counters$ = new BehaviorSubject<CounterItem[]>([]);

  readonly counters$ = this._counters$.asObservable();

  readonly countersCount$ = this.counters$.pipe(
    map((c) => c.length),
    distinctUntilChanged(),
  );

  readonly totalCount$ = this.counters$.pipe(
    map((counters: CounterItem[]) => {
      return counters.reduce((acc, counter) => acc + counter.count, 0);
    }),
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
}
