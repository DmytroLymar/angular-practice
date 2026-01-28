import { Component, inject } from '@angular/core';
import { CounterControlsComponent } from './counter-controls.component';
import { CounterDisplayComponent } from './counter-display.component';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.component.html',
  imports: [CounterControlsComponent, CounterDisplayComponent],
})
export class CounterComponent {
  private readonly counterService = inject(CounterService);

  get count(): number {
    return this.counterService.count;
  }

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
