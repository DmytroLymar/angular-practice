import { Component, inject, Input, output } from '@angular/core';
import { CounterControlsComponent } from './counter-controls.component';
import { CounterDisplayComponent } from './counter-display.component';
import { CounterItem } from './counters.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.component.html',
  imports: [CounterControlsComponent, CounterDisplayComponent],
})
export class CounterComponent {
  @Input({ required: true }) counter!: CounterItem;

  increment = output<void>();
  decrement = output<void>();
  reset = output<void>();
  remove = output<void>();

  onIncrement(): void {
    this.increment.emit();
  }

  onDecrement(): void {
    this.decrement.emit();
  }

  onReset(): void {
    this.reset.emit();
  }

  onRemove(): void {
    this.remove.emit();
  }
}
