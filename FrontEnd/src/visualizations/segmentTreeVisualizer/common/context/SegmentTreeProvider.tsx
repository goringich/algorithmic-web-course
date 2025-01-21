import React, { useState, useEffect, useRef } from "react";
import Konva from "konva";
import { SegmentTreeContextProps } from "./segmentTreeContext/SegmentTreeContextProps";
import SegmentTreeContext from "./segmentTreeContext/SegmentTreeContext"; 
import { VisNode } from "../../../visualisationComponents/nodeAnimations/types/VisNode";
import { buildParentMap } from "../../../visualisationComponents/nodeAnimations/utils/buildParentMap";
import useHighlightPath from "../../../visualisationComponents/highlightPathFromLeaf/hooks/useHighlightPath";
import { useDrag } from "../../../components/UseDrag";
import SegmentTreeWasm from "../../defaultSegmentTree/SegmentTreeWasm";
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
  const [parentMap, setParentMap] = useState<Record<number, number>>({});
  const [selectedNode, setSelectedNode] = useState<VisNode | null>(null);
  const [delta, setDelta] = useState<number>(0);

  const [data, setData] = useState<number[]>(initialData);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");

  const [stageSize, setStageSize] = useState({ width: 1200, height: 500 });

  const highlightPathFromLeaf = useHighlightPath({ nodes, parentMap, setNodes });

  const {
    position: editBoxPos,
    handleMouseDown: handleEditBoxMouseDown,
    handleMouseMove: handleEditBoxMouseMove,
    handleMouseUp: handleEditBoxMouseUp
  } = useDrag(400, 300);

  const segmentTreeWasmRef = useRef<SegmentTreeWasm | null>(null);

  useEffect(() => {
    // Инициализация только один раз
    if (!segmentTreeWasmRef.current) {
      segmentTreeWasmRef.current = new SegmentTreeWasm(initialData);
      // Получаем дерево для визуализации
      segmentTreeWasmRef.current.getTreeForVisualization().then((visNodes) => {
        setNodes(visNodes);
        setParentMap(buildParentMap(visNodes));
      }).catch(error => {
        console.error("Ошибка при построении дерева для визуализации:", error);
      });
    }
  }, [initialData]);
  // useEffect(() => {
  //   const newNodes = initialData.map((value, index) => ({
  //     id: index,
  //     value,
  //     range: [index, index],
  //     parentId: Math.floor((index - 1) / 2),
  //   }));
  //   setNodes(newNodes);
  //   setParentMap(buildParentMap(newNodes));
  // }, [initialData]);

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


    // Функции, чтобы не пробрасывать их через props
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
        buildSegmentTree,
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
  
    // Формируем value контекста
    const value: SegmentTreeContextProps = {
      data,
      setData,
      nodes,
      setNodes,
      parentMap,
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

