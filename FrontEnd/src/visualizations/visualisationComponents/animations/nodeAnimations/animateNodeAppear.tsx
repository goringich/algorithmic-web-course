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
      circleRef.current.opacity(0);
      circleRef.current.to({
        opacity: 1,
        duration: 1,
        easing: Konva.Easings.EaseInOut,
        onFinish: () =>
          console.log(`[INFO] Node ${nodeId} fully appeared at (${x}, ${y})`),
      });
    }
    if (circleRef.current && !shapeRefs.current[nodeId]) {
      shapeRefs.current[nodeId] = circleRef.current;
    }
  }, []);

  return circleRef;
};
