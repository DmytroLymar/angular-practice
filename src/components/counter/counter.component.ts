import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.component.html',
  imports: [],
})
export class CounterComponent {
  count: number = 0;

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
