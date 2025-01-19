// src/context/SegmentTreeProvider.tsx
import React, { useRef, useState, useEffect, ReactNode } from "react";
import Konva from "konva";
import { VisNode } from "@src/visualizations/visualisationComponents/nodeAnimations/types/VisNode";
import SegmentTreeContext, { SegmentTreeContextProps } from "./SegmentTreeContext";
import useSegmentTree from "../../defaultSegmentTree/useSegmentTree/UseSegmentTree";
import { buildParentMap } from "../../../visualisationComponents/nodeAnimations/utils/buildParentMap"; // Убедитесь в правильности пути импорта

interface SegmentTreeProviderProps {
  initialData: number[];
  children: ReactNode;
}

export const SegmentTreeProvider: React.FC<SegmentTreeProviderProps> = ({ initialData, children }) => {
  const layerRef = useRef<Konva.Layer>(null);  
  const shapeRefs = useRef<Record<string, Konva.Circle>>({});
  const [data, setData] = useState(initialData);
  const [nodes, setNodes] = useState<VisNode[]>([]);
  const [parentMap, setParentMap] = useState<Record<number, number>>({});
  
  const { updateTreeWithNewData } = useSegmentTree({ initialData: data, shapeRefs, layerRef });

  // Инициализация дерева при монтировании
  useEffect(() => {
    updateTreeWithNewData(data).then((newNodes) => {
      if (newNodes) {
        setNodes(newNodes);
        setParentMap(buildParentMap(newNodes));
      }
    }).catch((error) => {
      console.error("Ошибка при инициализации дерева сегментов:", error);
    });
  }, [data, updateTreeWithNewData]);

  const contextValue: SegmentTreeContextProps = {
    nodes,
    parentMap,
    updateTreeWithNewData,
    setNodes,
    setParentMap,
    shapeRefs,
    layerRef
  };

  return (
    <SegmentTreeContext.Provider value={contextValue}>
      {children}
    </SegmentTreeContext.Provider>
  );
};
