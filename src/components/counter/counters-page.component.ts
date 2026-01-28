import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CountersService } from './counters.service';
import { CounterComponent } from './counter.component';
import { combineLatest, map, startWith } from 'rxjs';

@Component({
  selector: 'app-counters-page',
  standalone: true,
  templateUrl: './counters-page.component.html',
  imports: [AsyncPipe, CounterComponent],
})
export class CountersPageComponent {
  private readonly countersService = inject(CountersService);

  readonly vm$ = combineLatest({
    counters: this.countersService.counters$,
    loading: this.countersService.loading$,
    error: this.countersService.error$,
  }).pipe(
    map(({ counters, loading, error }) => ({
      counters,
      loading,
      error,
      hasCounters: counters.length > 0,
    })),
    startWith({ counters: [], loading: false, error: null as string | null, hasCounters: false }),
  );

  addCounter(): void {
    this.countersService.addCounter();
  }

  resetAll(): void {
    this.countersService.resetAll();
  }

  clearStorage(): void {
    this.countersService.clearStorage();
  }

  increment(id: number) {
    this.countersService.increment(id);
  }

  decrement(id: number) {
    this.countersService.decrement(id);
  }

  reset(id: number) {
    this.countersService.reset(id);
  }

  remove(id: number): void {
    this.countersService.removeCounter(id);
  }

  ngOnInit() {
    this.countersService.load();
  }

  reload() {
    this.countersService.load();
  }
  reloadFail() {
    this.countersService.load({ fail: true });
  }
}
