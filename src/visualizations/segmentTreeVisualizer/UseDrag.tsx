import { useState } from "react";

interface DragPosition {
  x: number;
  y: number;
}

export function useDrag(initialX: number, initialY: number) {
  const [position, setPosition] = useState<DragPosition>({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<DragPosition>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLSpanElement>,
    maxWidth: number,
    maxHeight: number,
    boxWidth: number,
    boxHeight: number
  ) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    const clampedX = Math.max(0, Math.min(newX, maxWidth - boxWidth));
    const clampedY = Math.max(0, Math.min(newY, maxHeight - boxHeight));
    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}
