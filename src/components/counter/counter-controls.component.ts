import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-counter-controls',
  standalone: true,
  templateUrl: './counter-controls.component.html',
  imports: [],
})
export class CounterControlsComponent {
  @Input({ required: true }) count!: number;

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
