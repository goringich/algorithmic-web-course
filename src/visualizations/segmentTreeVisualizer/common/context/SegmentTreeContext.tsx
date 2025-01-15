// src/context/SegmentTreeContext.tsx
import React, { createContext, useContext } from "react";
import Konva from "konva";
import { VisNode } from "@src/visualizations/visualisationComponents/nodeAnimations/types/VisNode";

// Определяем интерфейс для контекста
export interface SegmentTreeContextProps {
  nodes: VisNode[];
  parentMap: Record<number, number>;
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>;
  layerRef: React.MutableRefObject<Konva.Layer | null>;
}

// Создаём Context
const SegmentTreeContext = createContext<SegmentTreeContextProps | undefined>(undefined);

// Хук для использования контекста
export const useSegmentTreeContext = () => {
  const context = useContext(SegmentTreeContext);
  if (!context) {
    throw new Error('useSegmentTreeContext must be used within a SegmentTreeProvider');
  }
  return context;
};

export default SegmentTreeContext;
