import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CounterService {
  private readonly _count$ = new BehaviorSubject<number>(0);

  readonly count$ = this._count$.asObservable();

  increase(): void {
    this._count$.next(this._count$.value + 1);
  }
  decrease(): void {
    this._count$.next(Math.max(0, this._count$.value - 1));
  }
  reset(): void {
    this._count$.next(0);
  }
}
