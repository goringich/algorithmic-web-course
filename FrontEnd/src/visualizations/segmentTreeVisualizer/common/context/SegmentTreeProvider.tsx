import React, { useState, useEffect, useRef } from "react";
import Konva from "konva";
import { SegmentTreeContextProps } from "./segmentTreeContext/SegmentTreeContextProps";
import SegmentTreeContext from "./segmentTreeContext/SegmentTreeContext"; 
import { VisNode } from "../../../visualisationComponents/nodeAnimations/types/VisNode";
import { buildParentMap } from "../../../visualisationComponents/nodeAnimations/utils/buildParentMap";
import useUpdateSegmentTree from "../../defaultSegmentTree/hooks/useUpdateSegmentTree";
import useHighlightPath from "../../../visualisationComponents/highlightPathFromLeaf/hooks/useHighlightPath";
import { useDrag } from "../../../components/UseDrag";
import SegmentTreeWasm from "../../defaultSegmentTree/SegmentTreeWasm";
// Импорт обработчиков (buildTree больше не передаём)
import { handleCloseSnackbar, handleAddElement, handleUpdateNode, handleRemoveLeaf, handleNodeClick } from "../../defaultSegmentTree/handlers/segmentTreeHandlers";

interface SegmentTreeProviderProps {
  children: React.ReactNode;
  initialData: number[];
}

export const SegmentTreeProvider: React.FC<SegmentTreeProviderProps> = ({ initialData, children }) => {
  const MAX_LEAVES = 16;
  
  const shapeRefs = useRef<Record<string, Konva.Circle>>({});
  const layerRef = useRef<Konva.Layer | null>(null);
  const [nodes, setNodes] = useState<VisNode[]>([]);
  // Изменили тип: теперь значения могут быть number или undefined
  const [parentMap, setParentMap] = useState<Record<number, number | undefined>>({});
  const [selectedNode, setSelectedNode] = useState<VisNode | null>(null);
  const [delta, setDelta] = useState<number>(0);
  const [data, setData] = useState<number[]>(initialData);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [stageSize, setStageSize] = useState({ width: 1200, height: 500 });

  const highlightPathFromLeaf = useHighlightPath({ nodes, parentMap, setNodes });

  // Если в вашем интерфейсе контекста изменить типы событий на React.MouseEvent, то можно напрямую передавать
  const {
    position: editBoxPos,
    handleMouseDown: handleEditBoxMouseDown,
    handleMouseMove: handleEditBoxMouseMove,
    handleMouseUp: handleEditBoxMouseUp
  } = useDrag(400, 300);

  const segmentTreeWasmRef = useRef<SegmentTreeWasm | null>(null);

  useEffect(() => {
    if (!segmentTreeWasmRef.current) {
      segmentTreeWasmRef.current = new SegmentTreeWasm(initialData);
      segmentTreeWasmRef.current.getTreeForVisualization().then((visNodes) => {
        setNodes(visNodes);
        setParentMap(buildParentMap(visNodes));
      }).catch(error => {
        console.error("Ошибка при построении дерева для визуализации:", error);
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (layerRef.current) {
      console.log("Redrawing layer due to nodes state change.");
      layerRef.current.draw();
    }
  }, [nodes]);

  const { updateTreeWithNewData } = useUpdateSegmentTree({
    nodes,
    setNodes,
    parentMap,
    setParentMap,
    segmentTree: segmentTreeWasmRef.current,
    shapeRefs,
    layerRef,
  });
  
  // Обработчики
  const onAddElement = () => {
    handleAddElement({
      newValue,
      setNewValue,
      data,
      setData,
      setSnackbarMessage,
      setSnackbarOpen,
      MAX_LEAVES,
      updateTreeWithNewData,
      // buildTree не передаём
      setParentMap
    });
  };
  
  const onUpdateNode = () => {
    handleUpdateNode({
      selectedNode,
      setSelectedNode,
      delta,
      setDelta,
      data,
      setData,
      setSnackbarMessage,
      setSnackbarOpen,
      // Обновлён тип parentMap:
      parentMap,
      highlightPathFromLeaf,
      updateTreeWithNewData
    });
  };
  
  const onRemoveLeaf = () => {
    handleRemoveLeaf({
      selectedNode,
      setSelectedNode,
      data,
      setData,
      setSnackbarMessage,
      setSnackbarOpen,
      // Обновлён тип parentMap:
      parentMap,
      updateTreeWithNewData,
      shapeRefs
    });
  };
  
  const onNodeClick = (node: VisNode) => {
    handleNodeClick({
      node,
      setSelectedNode,
      setDelta
    });
  };
  
  const onCloseSnackbar = () => {
    handleCloseSnackbar({ setSnackbarOpen });
  };
  
  const value: SegmentTreeContextProps = {
    data,
    setData,
    nodes,
    setNodes,
    parentMap, // тип Record<number, number | undefined>
    setParentMap,
    selectedNode,
    setSelectedNode,
    delta,
    setDelta,
    snackbarOpen,
    setSnackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    newValue,
    setNewValue,
    shapeRefs,
    layerRef,
    editBoxPos,
    handleEditBoxMouseDown,
    handleEditBoxMouseMove,
    handleEditBoxMouseUp,
  
    onAddElement,
    onUpdateNode,
    onRemoveLeaf,
    onNodeClick,
    onCloseSnackbar,
  
    highlightPathFromLeaf,
  
    stageSize,
    setStageSize
  };

  return (
    <SegmentTreeContext.Provider value={value}>
      {children}
    </SegmentTreeContext.Provider>
  );
};
