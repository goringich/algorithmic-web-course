import React, { useState, useEffect, useRef, useMemo } from "react";
import Konva from "konva";
import { SegmentTreeContextProps } from "./segmentTreeContext/SegmentTreeContextProps";
import SegmentTreeContext from "./segmentTreeContext/SegmentTreeContext";
import { VisNode } from "../../../types/VisNode";
import { buildParentMap } from "../../../visualisationComponents/nodeAnimations/utils/buildParentMap";
import useUpdateSegmentTree from "../../defaultSegmentTree/useSegmentTree/hooks/useUpdateSegmentTree";
import useHighlightPath from "../../../visualisationComponents/highlightPathFromLeaf/hooks/useHighlightPath";
import { useDrag } from "../../../components/UseDrag";
import SegmentTreeWasm from "../../defaultSegmentTree/SegmentTreeWasm";
import { handleRemoveLeaf } from "../handlers/handleRemoveLeaf";
import { handleAddElement } from "../handlers/handleAddElement";
import { handleUpdateNode } from "../handlers/handleUpdateNode";
import { handleCloseSnackbar, handleNodeClick } from "../handlers/generalHandlers";

interface SegmentTreeProviderProps {
  children: React.ReactNode;
  initialData: number[];
}

export const SegmentTreeProvider: React.FC<SegmentTreeProviderProps> = ({ initialData, children }) => {
  const MAX_LEAVES = 16;

  const shapeRefs = useRef<Record<string, Konva.Circle>>({});
  const layerRef = useRef<Konva.Layer | null>(null);
  const [nodes, setNodes] = useState<VisNode[]>([]);
  const [parentMap, setParentMap] = useState<Record<number, number | undefined>>({});
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
    if (!segmentTreeWasmRef.current) {
      segmentTreeWasmRef.current = new SegmentTreeWasm(initialData);
    }
    
    const updateTree = async () => {
      try {
        const visNodes = await segmentTreeWasmRef.current?.getTreeForVisualization();
        if (visNodes && visNodes.length > 0) {
          const visNodesWithParent = visNodes.map((node, index) => ({
            ...node,
            parentId: (node as any).parentId !== undefined ? (node as any).parentId : (index === 0 ? undefined : 0),
            isHighlighted: false,
            children: node.children as unknown as number[],
          }));

          console.log("Setting nodes:", visNodesWithParent);
          setNodes(visNodesWithParent);
          setParentMap(buildParentMap(visNodesWithParent));
        }
      } catch (error) {
        console.error("Ошибка при построении дерева для визуализации:", error);
      }
    };

    updateTree();
  }, [data]); // Зависимость только от data

  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedParentMap = useMemo(() => parentMap, [parentMap]);

  const { updateTreeWithNewData } = useUpdateSegmentTree({
    nodes: memoizedNodes,
    setNodes,
    parentMap: memoizedParentMap,
    setParentMap,
    segmentTree: segmentTreeWasmRef.current,
    shapeRefs,
    layerRef,
  });

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

  const onRemoveLeaf = async () => {
    if (!selectedNode) return;
    
    console.log("Данные перед удалением узла:", data);
    
    try {
      await handleRemoveLeaf({
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
      
      // Сбрасываем выбранный узел после успешного удаления
      setSelectedNode(null);
      
    } catch (error) {
      console.error("Ошибка при удалении узла:", error);
      setSnackbarMessage("Ошибка при удалении узла");
      setSnackbarOpen(true);
    }
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
    nodes: memoizedNodes,
    setNodes,
    parentMap: memoizedParentMap,
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
