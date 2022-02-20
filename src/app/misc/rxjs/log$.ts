import { Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

export function log$<T>(
  info?: ((x: T) => unknown) | unknown
): UnaryFunction<Observable<T | null | undefined>, Observable<T>> {
  function log(event: string, data?: any) {
    const args: unknown[] = [event];
    if (info) {
      if (typeof info === 'function') {
        data = info(data);
      } else {
        args.unshift(info);
      }
    }
    if (event !== 'tap.complete') {
      args.push(data);
    }
    console.log(...args);
  }
  return pipe(
    tap<T>(
      (x) => {
        log('tap.next', x);
      },
      (x) => {
        log('tap.error', x);
      },
      () => {
        log('tap.complete');
      }
    ) as OperatorFunction<T | null | undefined, T>
  );
}
