import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type CounterItem = {
  id: number;
  count: number;
};

@Injectable({ providedIn: 'root' })
export class CountersService {
  private nextId = 1;
  private readonly _counters$ = new BehaviorSubject<CounterItem[]>([]);

  readonly counters$ = this._counters$.asObservable();

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
