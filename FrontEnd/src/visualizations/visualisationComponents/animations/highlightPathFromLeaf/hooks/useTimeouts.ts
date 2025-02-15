import { useRef, useEffect, useCallback } from "react";

export default function useTimeouts() {
  const timeoutsRef = useRef<number[]>([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearAllTimeouts();
    };
  }, []);

  const setAndStoreTimeout = useCallback((callback: () => void, delay: number) => {
    const timeout = window.setTimeout(() => {
      if (isMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  return { setAndStoreTimeout, clearAllTimeouts };
}
