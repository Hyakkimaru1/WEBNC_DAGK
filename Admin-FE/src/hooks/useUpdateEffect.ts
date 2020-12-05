// @flow
// libs import
import { useEffect, useRef } from "react";

export const useUpdateEffect = (
  effect: Function = () => {},
  deps: Array<any> = []
) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
