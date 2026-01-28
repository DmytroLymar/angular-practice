import { Component } from '@angular/core';
import { CounterComponent } from '../components/counter/counter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CounterComponent],
  template: `
    <div>
      <h1>App</h1>
      <app-counter />
    </div>
  `,
})
export class App {}
