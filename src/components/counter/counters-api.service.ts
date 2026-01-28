import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type CounterItem = { id: number; count: number };

@Injectable({ providedIn: 'root' })
export class CountersApiService {
  constructor(private http: HttpClient) {}

  getCounters(opts?: { fail?: boolean }): Observable<CounterItem[]> {
    const params = opts?.fail ? new HttpParams().set('fail', '1') : undefined;
    return this.http.get<CounterItem[]>('/api/counters', { params });
  }

  addCounter(): Observable<CounterItem> {
    return this.http.post<CounterItem>('/api/counters', {});
  }

  updateCount(id: number, count: number): Observable<CounterItem> {
    return this.http.patch<CounterItem>(`/api/counters/${id}`, { count });
  }

  removeCounter(id: number): Observable<{ ok: true }> {
    return this.http.delete<{ ok: true }>(`/api/counters/${id}`);
  }
}
