// src/hooks/useNodeAppearAnimation.ts

import { useEffect, useRef } from "react";
import Konva from "konva";

export const useNodeAppearAnimation = (
  nodeId: number,
  x: number,
  y: number,
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>
) => {
  const circleRef = useRef<Konva.Circle | null>(null);

  useEffect(() => {
    if (circleRef.current) {
      // Начинаем с прозрачности 0
      circleRef.current.opacity(0);
      circleRef.current.to({
        opacity: 1,
        duration: 1,
        easing: Konva.Easings.EaseInOut,
        onFinish: () =>
          console.log(`[INFO] Node ${nodeId} fully appeared at (${x}, ${y})`),
      });
    }
    // Регистрируем узел в shapeRefs, если он ещё не зарегистрирован
    if (circleRef.current && !shapeRefs.current[nodeId]) {
      shapeRefs.current[nodeId] = circleRef.current;
    }
  }, []); // Запускаем только при монтировании

  return circleRef;
};
