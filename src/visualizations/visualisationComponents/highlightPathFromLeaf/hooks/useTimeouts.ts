import { useRef, useEffect } from 'react';

const useTimeouts = () => {
  const timeoutsRef = useRef<number[]>([]);

  const setAndStoreTimeout = (callback: () => void, delay: number): number => {
    const timeout = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  return { setAndStoreTimeout, clearAllTimeouts };
};

export default useTimeouts;
