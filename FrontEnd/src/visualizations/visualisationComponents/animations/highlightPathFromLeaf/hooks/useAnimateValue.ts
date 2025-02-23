import { useState, useEffect } from "react";

function useAnimatedValue(targetValue: number, duration: number = 500) {
  const [animatedValue, setAnimatedValue] = useState(targetValue);
  useEffect(() => {
    const startValue = animatedValue;
    const diff = targetValue - startValue;
    const startTime = performance.now();
    const step = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = startValue + diff * progress;
      setAnimatedValue(currentValue);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [targetValue]);
  return animatedValue;
}

export default useAnimatedValue;
