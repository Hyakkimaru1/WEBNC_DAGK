// @flow
// libs import
import { useCallback, useEffect, useRef } from "react";
import { useUpdateEffect } from "./useUpdateEffect";

// https://github.com/umijs/hooks/blob/master/packages/hooks/src/useThrottleFn/index.ts
export const useThrottleFn = (
  fn: Function,
  deps: Array<any> = [],
  wait: number = 500
) => {
  const timer = useRef<any>();

  const fnRef = useRef<Function>(fn);
  fnRef.current = fn;

  const currentArgs = useRef<any>([]);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = undefined;
  }, []);

  const run = useCallback(
    (...args: any) => {
      currentArgs.current = args;
      if (!timer.current) {
        timer.current = setTimeout(() => {
          fnRef.current(...currentArgs.current);
          timer.current = undefined;
        }, wait);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wait, cancel]
  );

  useUpdateEffect(() => {
    run();
  }, [...deps, run]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cancel, []);

  return {
    run,
    cancel
  };
};
