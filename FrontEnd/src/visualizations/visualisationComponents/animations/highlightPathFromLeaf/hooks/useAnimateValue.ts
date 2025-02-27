import { useState, useEffect } from "react";

function useAnimatedValue(targetValue: number, duration: number = 500, delay: number = 0) {
  const [animatedValue, setAnimatedValue] = useState(targetValue);
  useEffect(() => {
    const startValue = animatedValue;
    const diff = targetValue - startValue;
    const startTime = performance.now() + delay;
    let animationFrame: number;

    const step = (currentTime: number) => {
      if (currentTime < startTime) {
        animationFrame = requestAnimationFrame(step);
        return;
      }
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentVal = startValue + diff * progress;
      setAnimatedValue(currentVal);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetValue, delay]);
  return animatedValue;
}

export default useAnimatedValue;
