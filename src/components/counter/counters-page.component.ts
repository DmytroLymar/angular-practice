import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CountersService } from './counters.service';
import { CounterComponent } from './counter.component';

@Component({
  selector: 'app-counters-page',
  standalone: true,
  templateUrl: './counters-page.component.html',
  imports: [AsyncPipe, CounterComponent],
})
export class CountersPageComponent {
  private readonly countersService = inject(CountersService);

  readonly counters$ = this.countersService.counters$;
  readonly countersCount$ = this.countersService.countersCount$;
  readonly totalCount$ = this.countersService.totalCount$;
  readonly hasCounters$ = this.countersService.hasCounters$;

  addCounter(): void {
    this.countersService.addCounter();
  }

  resetAll(): void {
    this.countersService.resetAll();
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
}
