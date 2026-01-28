import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-counter-display',
  standalone: true,
  templateUrl: './counter-display.component.html',
  imports: [],
})
export class CounterDisplayComponent {
  @Input({ required: true }) count!: number;
}
