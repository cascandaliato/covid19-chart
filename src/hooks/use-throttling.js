import { useEffect } from "react";
import { asyncScheduler, Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";

const emitter = new Subject().pipe(
  throttleTime(5000, asyncScheduler, { leading: true, trailing: true })
);

const useThrottling = (fn) => {
  useEffect(() => {
    const sub = emitter.subscribe({
      next(args) {
        fn(...args);
      },
    });
    return () => sub.unsubscribe();
  }, [fn]);

  return (...args) => emitter.next(args);
};

export default useThrottling;
