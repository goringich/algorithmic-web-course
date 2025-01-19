import React, { useState, useEffect, useRef } from "react";
import Konva from "konva";
import { SegmentTreeContextProps } from "./segmentTreeContext/SegmentTreeContextProps";
import SegmentTreeContext from "./segmentTreeContext/SegmentTreeContext"; 
import { VisNode } from "@src/visualizations/visualisationComponents/nodeAnimations/types/VisNode";
import { buildParentMap } from "../../../visualisationComponents/nodeAnimations/utils/buildParentMap";

interface SegmentTreeProviderProps {
  initialData: number[];
  children: React.ReactNode;
}

export const SegmentTreeProvider: React.FC<SegmentTreeProviderProps> = ({ initialData, children }) => {
  const shapeRefs = useRef<Record<string, Konva.Circle>>({});
  const layerRef = useRef<Konva.Layer | null>(null);
  const [nodes, setNodes] = useState<VisNode[]>([]);
  const [parentMap, setParentMap] = useState<Record<number, number>>({});

  useEffect(() => {
    const newNodes = initialData.map((value, index) => ({
      id: index,
      value,
      range: [index, index],
      parentId: Math.floor((index - 1) / 2),
    }));
    setNodes(newNodes);
    setParentMap(buildParentMap(newNodes));
  }, [initialData]);

  const updateTreeWithNewData = async (newData: number[]): Promise<VisNode[] | null> => {
    try {
      const newNodes = newData.map((value, index) => ({
        id: index,
        value,
        range: [index, index],
        parentId: Math.floor((index - 1) / 2),
      }));
      setNodes(newNodes);
      setParentMap(buildParentMap(newNodes));
      return newNodes;
    } catch (error) {
      console.error("Error updating tree with new data:", error);
      return null;
    }
  };

  const value: SegmentTreeContextProps = {
    nodes,
    parentMap,
    updateTreeWithNewData,
    setNodes,
    setParentMap,
    shapeRefs,
    layerRef
  };

  return (
    <SegmentTreeContext.Provider value={value}>
      {children}
    </SegmentTreeContext.Provider>
  );
};

// export default SegmentTreeProvider;
