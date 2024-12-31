// src/components/SegmentTreeVisualizer/useDrag.js
import { useState } from "react";

const UseDrag = (initialPos, stageSize, modalSize) => {
  const [position, setPosition] = useState(initialPos);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Clamp X
    const maxX = stageSize.width - modalSize.width;
    const clampedX = Math.max(0, Math.min(newX, maxX));

    // Clamp Y
    const maxY = stageSize.height - modalSize.height;
    const clampedY = Math.max(0, Math.min(newY, maxY));

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    position,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDragging,
  };
};

export default UseDrag;
