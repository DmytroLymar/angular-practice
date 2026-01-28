import { Component, inject } from '@angular/core';
import { CounterControlsComponent } from './counter-controls.component';
import { CounterDisplayComponent } from './counter-display.component';
import { CounterService } from './counter.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.component.html',
  imports: [CounterControlsComponent, CounterDisplayComponent, AsyncPipe],
})
export class CounterComponent {
  private readonly counterService = inject(CounterService);

  readonly count$ = this.counterService.count$;

  increase(): void {
    this.counterService.increase();
  }

  decrease(): void {
    this.counterService.decrease();
  }

  reset(): void {
    this.counterService.reset();
  }
}
