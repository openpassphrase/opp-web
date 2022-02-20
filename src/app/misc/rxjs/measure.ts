import { pipe } from 'rxjs';
import { tap } from 'rxjs/operators';

export function measureStart<T>(name: string) {
  return pipe(
    tap<T>(() => {
      window.performance.mark(`${name}:next:start`);
    })
  );
}

export function measureEnd<T>(name: string) {
  return pipe(
    tap<T>(() => {
      window.performance.mark(`${name}:next:end`);
      window.performance.measure(
        `${name}:next`,
        `${name}:next:start`,
        `${name}:next:end`
      );
      const duration = window.performance.getEntriesByName(`${name}:next`)[0]
        .duration;
      window.performance.clearMarks(`${name}:next:start`);
      window.performance.clearMarks(`${name}:next:end`);
      window.performance.clearMeasures(`${name}:next`);
      console.log(`${name}:next`, duration);
    })
  );
}
