// @flow
// libs import
import { useCallback, useEffect, useRef } from "react";
import { useUpdateEffect } from "./useUpdateEffect";

// https://github.com/umijs/hooks/blob/master/packages/hooks/src/useDebounceFn/index.ts
export const useDebounceFn = (
  fn: Function,
  deps: Array<any> = [],
  wait: number = 300
) => {
  const timer = useRef<any>();

  const fnRef = useRef<Function>(fn);
  fnRef.current = fn;

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  }, []);

  const run = useCallback(
    (...args: any) => {
      cancel();
      timer.current = setTimeout(() => {
        fnRef.current(...args);
      }, wait);
    },
    [wait, cancel]
  );

  useUpdateEffect(() => {
    run();
    return cancel;
  }, [...deps, run]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cancel, []);

  return {
    run,
    cancel
  };
};
