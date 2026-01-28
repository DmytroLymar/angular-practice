import {
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { defer, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

type CounterItem = { id: number; count: number };

let countersDb: CounterItem[] = [
  { id: 1, count: 0 },
  { id: 2, count: 3 },
  { id: 3, count: 1 },
];

function ok<T>(body: T) {
  return of(new HttpResponse({ status: 200, body }));
}

function fail(status: number, message: string) {
  return throwError(
    () =>
      new HttpErrorResponse({
        status,
        statusText: message,
        error: { message },
      }),
  );
}

function shouldFail(req: HttpRequest<unknown>) {
  return req.params.get('fail') === '1';
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  return defer(() => of(null)).pipe(
    delay(700),
    mergeMap(() => {
      if (req.method === 'GET' && req.url === '/api/counters') {
        if (shouldFail(req)) return fail(500, 'Mock error: failed to load counters');
        return ok(countersDb);
      }

      if (req.method === 'POST' && req.url === '/api/counters') {
        const nextId = countersDb.reduce((m, c) => Math.max(m, c.id), 0) + 1;
        const created = { id: nextId, count: 0 };
        countersDb = [...countersDb, created];
        return ok(created);
      }

      const patchMatch = req.url.match(/^\/api\/counters\/(\d+)$/);
      if (req.method === 'PATCH' && patchMatch) {
        const id = Number(patchMatch[1]);
        const body = (req.body ?? {}) as Partial<CounterItem>;
        const exists = countersDb.some((c) => c.id === id);
        if (!exists) return fail(404, 'Counter not found');

        countersDb = countersDb.map((c) =>
          c.id === id ? { ...c, ...body, count: Math.max(0, Number(body.count ?? c.count)) } : c,
        );
        return ok(countersDb.find((c) => c.id === id)!);
      }

      const delMatch = req.url.match(/^\/api\/counters\/(\d+)$/);
      if (req.method === 'DELETE' && delMatch) {
        const id = Number(delMatch[1]);
        countersDb = countersDb.filter((c) => c.id !== id);
        return ok({ ok: true });
      }

      return fail(404, 'Mock: route not found');
    }),
  );
};
