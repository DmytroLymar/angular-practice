import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
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
