import { Component } from '@angular/core';
import { CountersPageComponent } from '../components/counter/counters-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CountersPageComponent, CountersPageComponent],
  template: `
    <div>
      <h1>App</h1>
      <app-counters-page />
    </div>
  `,
})
export class App {}
