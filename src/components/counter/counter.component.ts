import { Component } from '@angular/core';
import { CounterControlsComponent } from './counter-controls.component';
import { CounterDisplayComponent } from './counter-display.component';

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.component.html',
  imports: [CounterControlsComponent, CounterDisplayComponent],
})
export class CounterComponent {
  count = 0;

  increase(): void {
    this.count++;
  }

  decrease(): void {
    if (this.count > 0) {
      this.count--;
    }
  }

  reset(): void {
    this.count = 0;
  }
}
