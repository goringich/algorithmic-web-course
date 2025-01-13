import React from 'react';
import { AddElementForm } from '../visualisationComponents/nodeControls/addElementForm/AddElementForm';

interface ControlsProps {
  newValue: string;
  setNewValue: React.Dispatch<React.SetStateAction<string>>;
  handleAddElement: () => Promise<void>;
  disabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({ newValue, setNewValue, handleAddElement, disabled }) => (
  <AddElementForm
    newValue={newValue}
    onChangeValue={setNewValue}
    onAdd={handleAddElement}
    disabled={disabled}
  />
);

export default Controls;
import React from 'react';
import { Typography } from '@mui/material';

const Header: React.FC = () => (
  <Typography variant="h4" marginBottom={2} sx={{ fontWeight: "bold" }}>
    Segment Tree Visualizer (WASM)
  </Typography>
);

export default Header;
// src/visualisations/segmentTreeVisualizer/components/TreeArea.tsx

import React from 'react';
import { SegmentTreeCanvas } from '../visualisationComponents/segmentTreeCanvas/SegmentTreeCanvas';
import { VisNode } from '../visualisationComponents/nodeAnimations/types/VisNode';

interface TreeAreaProps {
  nodes: VisNode[];
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>; // Изменено на Record<number, ...>
  selectedNodeId: number | null; // Изменено на number | null
  stageSize: { width: number; height: number };
  circleColor: string;
  highlightColor: string;
  selectedColor: string;
  lineColor: string;
  leafStrokeWidth: number;
  internalNodeStrokeWidth: number;
  getTextColor: (fill: string) => string;
  onNodeClick: (node: VisNode) => void;
}

const TreeArea: React.FC<TreeAreaProps> = ({
  nodes,
  shapeRefs,
  selectedNodeId,
  stageSize,
  circleColor,
  highlightColor,
  selectedColor,
  lineColor,
  leafStrokeWidth,
  internalNodeStrokeWidth,
  getTextColor,
  onNodeClick
}) => (
  <SegmentTreeCanvas
    nodes={nodes}
    shapeRefs={shapeRefs}
    selectedNodeId={selectedNodeId}
    stageSize={stageSize}
    circleColor={circleColor}
    highlightColor={highlightColor}
    selectedColor={selectedColor}
    lineColor={lineColor}
    leafStrokeWidth={leafStrokeWidth}
    internalNodeStrokeWidth={internalNodeStrokeWidth}
    getTextColor={getTextColor}
    onNodeClick={onNodeClick}
  />
);

export default TreeArea;
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
// hooks/useInitializeSegmentTree.ts
import { useState, useCallback, useRef } from 'react';
import SegmentTreeWasm from '../../../SegmentTreeWasm';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import { buildParentMap } from '../../../visualisationComponents/nodeAnimations/utils/buildParentMap';

interface UseInitializeSegmentTreeProps {
  initialData: number[];
}

interface UseInitializeSegmentTreeReturn {
  segmentTree: SegmentTreeWasm | null;
  initialNodes: VisNode[];
  initialParentMap: Record<number, number>;
  initialize: () => Promise<void>;
}

const useInitializeSegmentTree = ({ initialData }: UseInitializeSegmentTreeProps): UseInitializeSegmentTreeReturn => {
  const [initialNodes, setInitialNodes] = useState<VisNode[]>([]);
  const [initialParentMap, setInitialParentMap] = useState<Record<number, number>>({});
  const segmentTreeRef = useRef<SegmentTreeWasm | null>(null);

  const initialize = useCallback(async () => {
    if (segmentTreeRef.current) return; // Уже инициализировано

    try {
      const st = new SegmentTreeWasm(initialData);
      segmentTreeRef.current = st;

      const nodes = await st.getTreeForVisualization();
      setInitialNodes(nodes);
      const parentMap = buildParentMap(nodes);
      setInitialParentMap(parentMap);

      // console.log('Initial parentMap:', parentMap);
    } catch (error) {
      console.error("Ошибка при инициализации дерева:", error);
    }
  }, [initialData]);

  return { 
    segmentTree: segmentTreeRef.current, 
    initialNodes, 
    initialParentMap, 
    initialize 
  };
};

export default useInitializeSegmentTree;
// hooks/useSegmentTreeAnimations.ts
import { useCallback } from 'react';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import { animateNodeMove, animateNodeAppear, animateNodeDisappear } from '../../../visualisationComponents/nodeAnimations/nodeAnimations';
import { buildParentMap } from '../../../visualisationComponents/nodeAnimations/utils/buildParentMap';
import Konva from 'konva';

interface UseSegmentTreeAnimationsProps {
  shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>;
}

const useSegmentTreeAnimations = ({ shapeRefs }: UseSegmentTreeAnimationsProps) => {
  const handleAnimations = useCallback(
    (
      oldNodes: VisNode[],
      newNodes: VisNode[],
      newParentMap: Record<string, string>
    ) => {
      // Анимация исчезновения удалённых узлов
      const removedNodes = oldNodes.filter(oldNode => !newNodes.some(n => n.id === oldNode.id));
      removedNodes.forEach(rn => animateNodeDisappear(rn.id, shapeRefs.current));

      // Анимация перемещения и появления узлов
      newNodes.forEach(newN => {
        const oldNode = oldNodes.find(p => p.id === newN.id);
        if (oldNode) {
          if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
            animateNodeMove(newN.id, newN.x, newN.y, shapeRefs.current, newParentMap);
          }
        } else {
          setTimeout(() => {
            animateNodeAppear(newN.id, newN.x, newN.y, shapeRefs.current);
          }, 500);
        }
      });
    },
    [shapeRefs]
  );

  return { handleAnimations };
};

export default useSegmentTreeAnimations;
// hooks/useSegmentTreeState.ts
import { useState } from 'react';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';

interface UseSegmentTreeStateReturn {
  nodes: VisNode[];
  parentMap: Record<number, number>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

const useSegmentTreeState = (): UseSegmentTreeStateReturn => {
  const [nodes, setNodes] = useState<VisNode[]>([]);
  const [parentMap, setParentMap] = useState<Record<number, number>>({});

  return { nodes, parentMap, setNodes, setParentMap };
};

export default useSegmentTreeState;
// hooks/useUpdateSegmentTree.ts
import { useCallback } from 'react';
import SegmentTreeWasm from '../../../SegmentTreeWasm';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import { animateNodeMove, animateNodeAppear, animateNodeDisappear } from '../../../visualisationComponents/nodeAnimations/nodeAnimations';
import { buildParentMap } from '../../../visualisationComponents/nodeAnimations/utils/buildParentMap';

interface UseUpdateSegmentTreeProps {
  nodes: VisNode[];
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  parentMap: Record<number, number>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  segmentTree: SegmentTreeWasm | null;
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
}

interface UseUpdateSegmentTreeReturn {
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
}

const useUpdateSegmentTree = ({
  nodes,
  setNodes,
  parentMap,
  setParentMap,
  segmentTree,
  shapeRefs
}: UseUpdateSegmentTreeProps): UseUpdateSegmentTreeReturn => {
  const updateTreeWithNewData = useCallback(async (newData: number[]): Promise<VisNode[] | null> => {
    if (!segmentTree) {
      console.error("SegmentTreeWasm instance is not initialized.");
      return null;
    }

    try {
      // Обновляем данные и перестраиваем дерево
      await segmentTree.setData(newData);
      const newVisNodes = await segmentTree.getTreeForVisualization();
      console.log('Обновлённые узлы после обновления данных:', newVisNodes);

      // Строим parentMap на основе новых узлов
      const newParentMap = buildParentMap(newVisNodes);
      console.log('Новая parentMap:', newParentMap);

      // Анимация исчезновения удалённых узлов
      const removedNodes = nodes.filter(oldNode => !newVisNodes.some(n => n.id === oldNode.id));
      removedNodes.forEach(rn => animateNodeDisappear(rn.id, shapeRefs.current));

      // Анимация перемещения и появления узлов
      newVisNodes.forEach(newN => {
        const oldNode = nodes.find(p => p.id === newN.id);
        if (oldNode) {
          if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
            animateNodeMove(newN.id, newN.x, newN.y, shapeRefs.current, newParentMap);
          }
        } else {
          setTimeout(() => {
            animateNodeAppear(newN.id, newN.x, newN.y, shapeRefs.current);
          }, 500);
        }
      });

      // Обновляем parentMap и nodes
      setParentMap(newParentMap);
      setNodes(newVisNodes);
      console.log("Final parentMap after refresh:", newParentMap);

      return newVisNodes;
    } catch (error) {
      console.error("Ошибка при обновлении дерева:", error);
      return null;
    }
  }, [nodes, segmentTree, shapeRefs, setNodes, setParentMap]);

  return { updateTreeWithNewData };
};

export default useUpdateSegmentTree;
// hooks/useSegmentTree.ts
import { useEffect } from 'react';
import useInitializeSegmentTree from './hooks/useInitializeSegmentTree';
import useSegmentTreeState from './hooks/useSegmentTreeState';
import useUpdateSegmentTree from './hooks/useUpdateSegmentTree';

interface UseSegmentTreeProps {
  initialData: number[];
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
}

interface UseSegmentTreeReturn {
  nodes: VisNode[];
  parentMap: Record<number, number>;
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

const useSegmentTree = ({ initialData, shapeRefs }: UseSegmentTreeProps): UseSegmentTreeReturn => {
  const { segmentTree, initialNodes, initialParentMap, initialize } = useInitializeSegmentTree({ initialData });
  const { nodes, parentMap, setNodes, setParentMap } = useSegmentTreeState();
  const { updateTreeWithNewData } = useUpdateSegmentTree({
    nodes,
    setNodes,
    parentMap,
    setParentMap,
    segmentTree,
    shapeRefs
  });

  useEffect(() => {
    initialize().then(() => {
      setNodes(initialNodes);
      setParentMap(initialParentMap);
    });
  }, [initialize, initialNodes, initialParentMap, setNodes, setParentMap]);

  return {
    nodes,
    parentMap,
    updateTreeWithNewData,
    setNodes,
    setParentMap
  };
};

export default useSegmentTree;
// SegmentTreeVisualizer.tsx
import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import { useDrag } from "../components/UseDrag";
import { NotificationSnackbar } from "../../components/notificationSnackbar/NotificationSnackbar";
import { EditNodeModal } from "../visualisationComponents/nodeControls/editNodeModal/EditNodeModal";
import useHighlightPath from "../visualisationComponents/highlightPathFromLeaf/hooks/useHighlightPath";
import { VisNode } from "../visualisationComponents/nodeAnimations/types/VisNode"
import Header from '../components/Header';
import Controls from '../components/Controls';
import TreeArea from '../components/TreeArea';
import useSegmentTree from './useSegmentTree/UseSegmentTree'; 
import { animateNodeDisappear } from '../visualisationComponents/nodeAnimations/nodeAnimations'; 
import TreeStructure from "../visualisationComponents/segmentTreeNode/treeStructure/TreeStructure";

const MAX_LEAVES = 16;

export default function SegmentTreeVisualizer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shapeRefs = useRef<Record<string, Konva.Circle>>({});
  const [stageSize, setStageSize] = useState({ width: 1200, height: 500 });

  const [data, setData] = useState([5, 8, 6, 3, 2, 7, 2, 6]);
  const [selectedNode, setSelectedNode] = useState<VisNode | null>(null);
  const [delta, setDelta] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [newValue, setNewValue] = useState(""); // Объявляем состояние newValue

  const {
    position: editBoxPos,
    handleMouseDown: handleEditBoxMouseDown,
    handleMouseMove: handleEditBoxMouseMove,
    handleMouseUp: handleEditBoxMouseUp
  } = useDrag(400, 300);

  // Кастомный хук для управления деревом
  const { nodes, parentMap, updateTreeWithNewData, setNodes, setParentMap } = useSegmentTree({ initialData: data, shapeRefs });

  // Инициализация хука подсветки с передачей nodes
  const highlightPathFromLeaf = useHighlightPath({ nodes, parentMap, setNodes });

  // Добавление нового элемента
  const handleAddElement = async () => {
    if (newValue.trim() === "") {
      setSnackbarMessage("Введите значение для нового элемента.");
      setSnackbarOpen(true);
      return;
    }
    const value = parseInt(newValue, 10);
    if (isNaN(value)) {
      setSnackbarMessage("Неверный формат числа.");
      setSnackbarOpen(true);
      return;
    }

    if (data.length >= MAX_LEAVES) {
      setSnackbarMessage("Превышен лимит (16) листьев.");
      setSnackbarOpen(true);
      setNewValue("");
      return;
    }

    const updatedData = [...data, value];
    const newVisNodes = await updateTreeWithNewData(updatedData);
    if (!newVisNodes) {
      setSnackbarMessage("Ошибка при добавлении нового элемента.");
      setSnackbarOpen(true);
      return;
    }
    setData(updatedData);
    setNewValue("");
  };

  // Обновление значения листа
  const handleUpdate = async () => {
    if (!selectedNode) {
      setSnackbarMessage("Выберите узел для обновления.");
      setSnackbarOpen(true);
      return;
    }
    const [start, end] = selectedNode.range;
    if (start !== end) {
      setSnackbarMessage("Можно обновлять только листовые узлы.");
      setSnackbarOpen(true);
      return;
    }

    const updatedData = [...data];
    updatedData[start] = delta;
    setData(updatedData);

    const newVisNodes = await updateTreeWithNewData(updatedData);
    if (!newVisNodes) {
      setSnackbarMessage("Ошибка при обновлении узла.");
      setSnackbarOpen(true);
      return;
    }

    // Найти обновлённый листовой узел
    const leafNode = newVisNodes.find(n => n.range[0] === start && n.range[1] === end);
    if (!leafNode) {
      console.error(`Leaf node for range [${start}, ${end}] not found.`);
      setSnackbarMessage(`Узел [${start}, ${end}] не найден.`);
      setSnackbarOpen(true);
      return;
    }

    if (Object.keys(parentMap).length === 0) {
      console.warn("Skipping highlight: parentMap is empty.");
      setSnackbarMessage("parentMap пуст. Подсветка невозможна.");
      setSnackbarOpen(true);
      return;
    }

    highlightPathFromLeaf(leafNode.id);

    setSnackbarMessage(`Значение узла [${start},${end}] обновлено до ${delta}`);
    setSnackbarOpen(true);
    setSelectedNode(null);
  };

  // Удаление листа
  const handleRemoveLeaf = async () => {
    if (!selectedNode) {
      setSnackbarMessage("Выберите узел для удаления.");
      setSnackbarOpen(true);
      return;
    }
    const [start, end] = selectedNode.range;
    if (start !== end) {
      setSnackbarMessage("Можно удалять только листовые узлы.");
      setSnackbarOpen(true);
      return;
    }

    const pos = selectedNode.range[0];

    animateNodeDisappear(selectedNode.id, shapeRefs.current, async () => {
      const newArr = [...data];
      newArr.splice(pos, 1);
      const newVisNodes = await updateTreeWithNewData(newArr);
      if (!newVisNodes) {
        setSnackbarMessage("Ошибка при удалении узла.");
        setSnackbarOpen(true);
        return;
      }
      setData(newArr);
    });
    setSelectedNode(null);
  };

  // Обработка клика по узлу
  const handleNodeClick = (node: VisNode) => {
    // Только листы
    if (node.range[0] === node.range[1]) {
      setSelectedNode(node);
      setDelta(node.value);
    }
  };

  // Закрытие уведомления
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Стили
  const circleColor = "#4B7BEC";
  const highlightColor = "#FFC107";
  const selectedColor = "#34B3F1";
  const lineColor = "#9B59B6";
  const leafStrokeWidth = 2;
  const internalNodeStrokeWidth = 1;

  const getTextColor = (fill: string) => {
    if (fill === highlightColor) return "#000";
    if (fill === selectedColor) return "#fff";
    if (fill === circleColor) return "#fff";
    return "#fff";
  };

  return (
    <Box
      ref={containerRef}
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="start"
      padding="20px"
      boxSizing="border-box"
      bgcolor="#f8f9fa"
      onMouseMove={(e) =>
        handleEditBoxMouseMove(e, stageSize.width, stageSize.height, 300, 150)
      }
      onMouseUp={handleEditBoxMouseUp}
    >
      <Header />

      <Controls
        newValue={newValue}
        setNewValue={setNewValue}
        handleAddElement={handleAddElement}
        disabled={data.length >= MAX_LEAVES}
      />

      <TreeArea
        nodes={nodes}
        shapeRefs={shapeRefs}
        selectedNodeId={selectedNode?.id || null}
        stageSize={stageSize}
        circleColor={circleColor}
        highlightColor={highlightColor}
        selectedColor={selectedColor}
        lineColor={lineColor}
        leafStrokeWidth={leafStrokeWidth}
        internalNodeStrokeWidth={internalNodeStrokeWidth}
        getTextColor={getTextColor}
        onNodeClick={handleNodeClick}
      />

      <EditNodeModal
        selectedNode={selectedNode}
        delta={delta}
        setDelta={setDelta}
        onUpdate={handleUpdate}
        onRemove={handleRemoveLeaf}
        position={editBoxPos}
        onMouseDown={handleEditBoxMouseDown}
      />

      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />

      <TreeStructure parentMap={parentMap}/>
    </Box>
  );
}
import { useCallback } from 'react';
import { VisNode } from '../../nodeAnimations/types/VisNode';
import { buildPathFromLeaf } from '../buildPathFromLeaf';
import useNodeAnimations from './useNodeAnimations';

interface UseHighlightPathProps {
  nodes: VisNode[];
  parentMap: Record<number, number>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

const useHighlightPath = ({ nodes, parentMap, setNodes }: UseHighlightPathProps) => {
  const { animatePath, clearAllTimeouts } = useNodeAnimations({ setNodes });

  const highlightPathFromLeaf = useCallback(
    (leafNodeId: number) => {
      console.log(`Start highlighting from leaf: '${leafNodeId}'`);
      console.log("Current parentMap:", parentMap);
      console.log("Current nodes:", nodes);

      // Очистка существующих таймаутов и сброс выделений
      clearAllTimeouts();
      setNodes((oldNodes) => {
        const updatedNodes = oldNodes.map((n) => {
          if (n.isHighlighted) {
            return { ...n, isHighlighted: false };
          }
          return n;
        });
        return updatedNodes;
      });
      

      // Проверка существования leafNodeId в nodes
      const leafNode = nodes.find(n => n.id === leafNodeId);
      if (!leafNode) {
        console.error(`Leaf node with ID '${leafNodeId}' not found`);
        return;
      }

      // Построение пути от листа к корню
      const pathIds = buildPathFromLeaf(leafNodeId, nodes, parentMap);

      if (pathIds.length === 0) {
        console.warn(`No path found from leaf '${leafNodeId}' to root`);
        return;
      }

      // Анимация подсветки узлов
      animatePath(pathIds);
    },
    [nodes, parentMap, setNodes, animatePath, clearAllTimeouts]
  );

  return highlightPathFromLeaf;
};

export default useHighlightPath;
import { useCallback } from 'react';
import { VisNode } from '../../nodeAnimations/types/VisNode';
import useTimeouts from './useTimeouts';

interface UseNodeAnimationsProps {
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

const useNodeAnimations = ({ setNodes }: UseNodeAnimationsProps) => {
  const { setAndStoreTimeout, clearAllTimeouts } = useTimeouts();

  const animatePath = useCallback(
    (pathIds: number[]) => {
      pathIds.forEach((nodeId, index) => {
        // Подсветка узла
        setAndStoreTimeout(() => {
          console.log(`Highlighting node: '${nodeId}'`);
          setNodes((old) =>
            old.map((n) =>
              n.id === nodeId ? { ...n, isHighlighted: true } : n
            )
          );
        }, index * 800);

        // Снятие подсветки с предыдущего узла
        if (index > 0) {
          const prevNodeId = pathIds[index - 1];
          setAndStoreTimeout(() => {
            console.log(`Unhighlighting node: '${prevNodeId}'`);
            setNodes((old) =>
              old.map((n) =>
                n.id === prevNodeId ? { ...n, isHighlighted: false } : n
              )
            );
          }, index * 800);
        }
      });

      // Снятие подсветки с последнего узла после всех анимаций
      if (pathIds.length > 0) {
        const lastNodeId = pathIds[pathIds.length - 1];
        setAndStoreTimeout(() => {
          console.log(`Final unhighlighting of node: '${lastNodeId}'`);
          setNodes((old) =>
            old.map((n) =>
              n.id === lastNodeId ? { ...n, isHighlighted: false } : n
            )
          );
        }, pathIds.length * 800);
      }
    },
    [setAndStoreTimeout, setNodes]
  );

  return { animatePath, clearAllTimeouts };
};

export default useNodeAnimations;
import { useRef, useEffect, useCallback } from "react";

const useTimeouts = () => {
  const timeoutsRef = useRef<number[]>([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearAllTimeouts();
    };
  }, []);

  const setAndStoreTimeout = useCallback((callback: () => void, delay: number): number => {
    const timeout = window.setTimeout(() => {
      if (isMountedRef.current) {
        callback();
      }
    }, delay);
    timeoutsRef.current.push(timeout);
    return timeout;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  return { setAndStoreTimeout, clearAllTimeouts };
};

export default useTimeouts;
import { VisNode } from '../nodeAnimations/types/VisNode';

export const buildPathFromLeaf = (
  leafNodeId: number,
  nodes: VisNode[],
  parentMap: Record<number, number>
): number[] => {
  const pathIds: number[] = [];
  let currentId: number | undefined = leafNodeId;
  const visited = new Set<number>();
  let pId: number | undefined = undefined;

  while (currentId !== undefined && !visited.has(currentId)) {
    pathIds.push(currentId);
    visited.add(currentId);
    const currentNode = nodes.find(n => n.id === currentId);
    console.log(`Added to path: '${currentId}' (Range: ${currentNode?.range})`);

    if (!parentMap || !parentMap.hasOwnProperty(currentId)) {
      console.error(`parentMap is undefined or does not contain node '${currentId}'`);
      break;
    }

    pId = parentMap[currentId];
    if (pId === undefined || pId === null) {
      console.error(`No parent found for node '${currentId}'`);
      break;
    }

    const parentNode = nodes.find(n => n.id === pId);
    if (!parentNode) {
      console.error(`Parent node with ID '${pId}' not found in nodes`);
      break;
    }

    console.log(`Parent of '${currentId}': '${pId}' (Range: ${parentNode.range})`);

    if (pId === currentId) { // Достигнут корень
      console.log(`Reached end of path at: '${currentId}' (Range: ${currentNode?.range})`);
      break;
    }
    currentId = pId;
  }

  // Обнаружение цикла, исключая самореференцию корня
  if (pId !== undefined && pId !== currentId && visited.has(pId)) {
    console.error(`Cycle detected at node '${pId}'`);
  }

  console.log(`Final path from leaf to root:`, pathIds.map(id => {
    const node = nodes.find(n => n.id === id);
    return node ? `${id} (Range: ${node.range})` : id;
  }));

  return pathIds;
};
export interface VisNode {
  id: string;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children: string[];
  isHighlighted?: boolean;
}
import { VisNode } from '../types/VisNode';

export const buildParentMap = (newNodes: VisNode[]): Record<number, number> => {
  const map: Record<number, number> = {};

  // Создаем множество идентификаторов узлов для быстрого поиска
  const nodeIds = new Set(newNodes.map(node => node.id));

  // Связываем каждого ребенка с родителем
  for (const node of newNodes) {
    for (const childId of node.children) {
      if (!nodeIds.has(childId)) {
        console.warn(`Child node '${childId}' referenced by parent '${node.id}' does not exist in nodes.`);
        continue; // Пропускаем добавление в карту, так как ребенок отсутствует в nodes
      }

      if (map[childId] && map[childId] !== node.id) {
        console.warn(`Node '${childId}' has multiple parents: '${map[childId]}' and '${node.id}'`);
      }
      map[childId] = node.id;
    }
  }

  // Определяем корневые узлы (узлы без родителей)
  const rootNodes = newNodes.filter(node => !map.hasOwnProperty(node.id));

  if (rootNodes.length === 0) {
    console.error("No root node found in the tree.");
    // Опционально: назначаем первый узел как корень, если он существует
    if (newNodes.length > 0) {
      const firstNodeId = newNodes[0].id;
      map[firstNodeId] = firstNodeId;
      console.log(`Assigned node '${firstNodeId}' as root.`);
    }
  } else if (rootNodes.length > 1) {
    console.warn("Multiple root nodes detected:", rootNodes.map(n => n.id));
    // Присоединяем все дополнительные корни к первому корню
    const trueRoot = rootNodes[0];
    rootNodes.slice(1).forEach(root => {
      map[root.id] = trueRoot.id;
      console.log(`Reassigning root node '${root.id}' to true root '${trueRoot.id}'`);
    });
  }

  // Назначаем самореференцию для истинного корня
  if (rootNodes.length > 0) {
    const trueRoot = rootNodes[0];
    map[trueRoot.id] = trueRoot.id;
    // console.log(`True root detected: '${trueRoot.id}'`);
  }

  // console.log("Final parentMap:", map);

  return map;
};
import { VisNode } from '../../segmentTreeVisualizer/SegmentTreeVisualizer';
import Konva from 'konva';

export const animateNodeMove = (
  nodeId: number,
  newX: number,
  newY: number,
  shapeRefs: Record<number, Konva.Circle>,
  parentMap: Record<number, number>
): void => {
  const shape = shapeRefs[nodeId];

  if (!shape) {
    console.error(`Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  // Проверяем, является ли узел корневым (самореференцией)
  const isRoot = parentMap[nodeId] === nodeId;

  if (isRoot) {
    console.log(`Корневой узел ${nodeId} перемещается без анимации.`);
    shape.to({
      x: newX,
      y: newY,
      duration: 0.5,
      onFinish: () => {

      }
    });
  } else {
    // Анимация перемещения узла с использованием Tween
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      x: newX,
      y: newY,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => {

      }
    }).play();
  }
};

export const animateNodeAppear = (
  nodeId: number,
  x: number,
  y: number,
  shapeRefs: Record<number, Konva.Circle>
): void => {
  const shape = shapeRefs[nodeId];
  if (!shape) {
    console.error(`Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  // Устанавливаем начальные атрибуты для анимации появления
  shape.position({ x, y });
  shape.opacity(0);
  
  // Анимация появления узла
  shape.to({
    opacity: 1,
    duration: 0.5,
    easing: Konva.Easings.EaseInOut
  });
};

export const animateNodeDisappear = (
  nodeId: number,
  shapeRefs: Record<number, Konva.Circle>,
  callback?: () => void
): void => {
  const shape = shapeRefs[nodeId];
  if (!shape) {
    console.error(`Shape for nodeId ${nodeId} not found in shapeRefs`);
    return;
  }

  // Анимация исчезновения узла
  shape.to({
    opacity: 0,
    duration: 0.5,
    easing: Konva.Easings.EaseInOut,
    onFinish: () => {
      // Удаляем форму из сцены Konva
      shape.remove();
      
      // Удаляем ссылку на форму из shapeRefs
      delete shapeRefs[nodeId];
      console.log(`Shape '${nodeId}' removed from canvas`);

      // Выполняем обратный вызов, если он предоставлен
      if (callback) callback();
    }
  });
};
import React from "react";
import { Box, TextField, Button } from "@mui/material";

interface AddElementFormProps {
  newValue: string;
  onChangeValue: (val: string) => void;
  onAdd: () => void;
  disabled?: boolean;
}

export function AddElementForm({
  newValue,
  onChangeValue,
  onAdd,
  disabled
}: AddElementFormProps) {
  return (
    <Box display="flex" justifyContent="center" gap={2} marginBottom={2}>
      <TextField
        label="Новый лист"
        value={newValue}
        onChange={(e) => onChangeValue(e.target.value)}
        type="number"
        variant="outlined"
        sx={{ width: "150px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onAdd}
        sx={{ borderRadius: "20px" }}
        disabled={disabled}
      >
        Добавить
      </Button>
    </Box>
  );
}
import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

interface NodeData {
  id: string;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children: string[];
}

interface EditNodeModalProps {
  selectedNode: NodeData | null;
  delta: number;
  setDelta: (val: number) => void;
  onUpdate: () => void;
  onRemove: () => void;
  position: { x: number; y: number };
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function EditNodeModal({
  selectedNode,
  delta,
  setDelta,
  onUpdate,
  onRemove,
  position,
  onMouseDown
}: EditNodeModalProps) {
  if (!selectedNode) return null;

  return (
    <Box
      position="absolute"
      left={position.x}
      top={position.y}
      bgcolor="#fff"
      padding="20px"
      border="1px solid #ddd"
      borderRadius="10px"
      zIndex={100}
      width="300px"
      boxShadow="0 8px 16px rgba(0,0,0,0.1)"
      style={{ userSelect: "none" }}
    >
      <Box
        onMouseDown={onMouseDown}
        sx={{
          cursor: "move",
          backgroundColor: "#eee",
          padding: "5px 0",
          textAlign: "center",
          fontWeight: "bold",
          borderRadius: "5px"
        }}
      >
        Перетащи меня
      </Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 1 }}>
        Узел: {selectedNode.label}
      </Typography>
      <Typography variant="body2" sx={{ marginTop: 1 }}>
        <strong>ID:</strong> {selectedNode.id}
      </Typography>
      <Typography variant="body2">
        <strong>Координаты:</strong> ({selectedNode.x}, {selectedNode.y})
      </Typography>
      <Typography variant="body2">
        <strong>Диапазон:</strong> [{selectedNode.range[0]}, {selectedNode.range[1]}]
      </Typography>
      <Typography variant="body2">
        <strong>Значение:</strong> {selectedNode.value}
      </Typography>
      <Typography variant="body2">
        <strong>Дети:</strong> {selectedNode.children.length > 0 ? selectedNode.children.join(", ") : "Нет"}
      </Typography>
      <TextField
        type="number"
        value={delta}
        onChange={(e) => setDelta(parseInt(e.target.value, 10) || 0)}
        fullWidth
        sx={{ marginTop: 1 }}
      />
      <Button
        onClick={onUpdate}
        variant="contained"
        color="success"
        fullWidth
        sx={{ borderRadius: "20px", marginTop: 1 }}
      >
        Обновить
      </Button>
      <Button
        onClick={onRemove}
        variant="contained"
        color="error"
        fullWidth
        sx={{ borderRadius: "20px", marginTop: 1 }}
      >
        Удалить
      </Button>
    </Box>
  );
}
import React, { useEffect, useRef } from "react";
import { Layer, Line, Stage } from "react-konva";
import { SegmentTreeNode } from "../segmentTreeNode/SegmentTreeNode";

interface NodeData {
  id: string;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children: string[];
  isHighlighted?: boolean;
}

interface SegmentTreeCanvasProps {
  nodes: NodeData[];
  shapeRefs: React.MutableRefObject<Record<string, any>>;
  selectedNodeId: string | null;
  stageSize: { width: number; height: number };
  circleColor: string;
  highlightColor: string;
  selectedColor: string;
  lineColor: string;
  leafStrokeWidth: number;
  internalNodeStrokeWidth: number;
  getTextColor: (fill: string) => string;
  onNodeClick: (node: NodeData) => void;
}

function calculateDepth(node: NodeData, nodesMap: Record<string, NodeData>): number {
  let depth = 0;
  let current = node;

  while (current && nodesMap[current.id]) {
    const parent = Object.values(nodesMap).find((n) => n.children.includes(current.id));
    if (!parent) break;
    depth++;
    current = parent;
  }

  return depth;
}


export function SegmentTreeCanvas({
  nodes,
  shapeRefs,
  selectedNodeId,
  stageSize,
  circleColor,
  highlightColor,
  selectedColor,
  lineColor,
  leafStrokeWidth,
  internalNodeStrokeWidth,
  getTextColor,
  onNodeClick
}: SegmentTreeCanvasProps) {
  const nodesMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const layerRef = useRef<any>(null);

  useEffect(() => {
    // console.log("Обновление nodes:", nodes);
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }
  }, [nodes]);
  

  return (
    <Stage width={stageSize.width} height={stageSize.height}>
      <Layer>
        {nodes.map((parentNode) =>
          parentNode.children.map((childId) => {
            const childNode = nodes.find((n) => n.id === childId);
            if (!childNode) return null;
            return (
              <Line
                key={`${parentNode.id}-${childId}`}
                points={[parentNode.x, parentNode.y, childNode.x, childNode.y]}
                stroke={lineColor}
                strokeWidth={2}
                lineCap="round"
              />
            );
          })
        )}

        {nodes.map((node) => {
          const isLeaf = node.range[0] === node.range[1];
          let fillColor = circleColor;
          if (node.isHighlighted) fillColor = highlightColor;
          else if (selectedNodeId === node.id) fillColor = selectedColor;
          const strokeW = isLeaf ? leafStrokeWidth : internalNodeStrokeWidth;

          const depth = calculateDepth(node, nodesMap);

          return (
            <SegmentTreeNode
              key={node.id}
              node={{ ...node, depth }}
              shapeRef={(el) => (shapeRefs.current[node.id] = el)}
              onNodeClick={onNodeClick}
              fillColor={fillColor}
              strokeWidth={strokeW}
              textColor={getTextColor(fillColor)}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}
import React from 'react';

interface TreeStructureProps {
  parentMap: Record<string, string>;
}

const TreeStructure: React.FC<TreeStructureProps> = ({ parentMap }) => (
  <div>
    <h3>Tree Structure (parentMap)</h3>
    <pre>{JSON.stringify(parentMap, null, 2)}</pre>
  </div>
);

export default TreeStructure;
import React from "react";
import { Circle, Text } from "react-konva";
import Konva from "konva";

interface NodeData {
  id: string;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children: string[];
  depth?: number; 
  isHighlighted?: boolean;
}

interface SegmentTreeNodeProps {
  node: NodeData;
  shapeRef: (el: Konva.Circle | null) => void;
  onNodeClick: (node: NodeData) => void;
  strokeWidth: number;
  textColor: string;
}

export function SegmentTreeNode({
  node,
  shapeRef,
  onNodeClick,
  strokeWidth,
  textColor
}: SegmentTreeNodeProps) {

  const maxDepth = 6;

  // check if the node has depth, otherwise we set 0
  const depth = node.depth !== undefined ? node.depth : 0;

  // use non-linear scaling to increase the difference.
  const depthFactor = Math.pow(Math.min(depth / maxDepth, 1), 0.7);

  const minColor = [10, 10, 120];  
  const maxColor = [180, 220, 255]; 

  const interpolateColor = (min: number, max: number, factor: number) => 
    Math.round(min + (max - min) * factor);

  // console.log(`Node: ${node.id}, isHighlighted: ${node.isHighlighted}`);

  // Вычисляем цвет узла
  const fillColor = node.isHighlighted
  ? "orange"
  : `rgb(${interpolateColor(minColor[0], maxColor[0], depthFactor)}, 
         ${interpolateColor(minColor[1], maxColor[1], depthFactor)}, 
         ${interpolateColor(minColor[2], maxColor[2], depthFactor)})` || "#4B7BEC";


  // console.log(`Node: ${node.label}, Depth: ${depth}, DepthFactor: ${depthFactor}, Color: ${fillColor}`);
  // console.log(`Node Rendered: ${node.id}, isHighlighted: ${node.isHighlighted}`);


  return (
    <>
      <Circle
        ref={shapeRef}
        x={node.x}
        y={node.y}
        radius={30}
        fill={fillColor}
        stroke="black"
        strokeWidth={strokeWidth}
        onClick={() => onNodeClick(node)}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "pointer";
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "default";
        }}
        shadowColor="#000"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 2 }}
        shadowOpacity={0.2}
      />
      <Text
        x={node.x - 25}
        y={node.y - 15}
        text={`${node.label}\n(${node.value})`}
        fontSize={12}
        fill={textColor}
        align="center"
        width={50}
      />
    </>
  );
}
import createSegmentTreeModule from "../assets/JS_complied_algorithms/segment_tree.mjs";

interface SegmentTreeNodeData {
  id: number;
  x: number;
  y: number;
  value: number;
  label: string;
  range: [number, number];
  children: number[];
}

export default class SegmentTreeWasm {
  private array: number[];
  private modulePromise: Promise<any>;

  constructor(array: number[]) {
    if (!Array.isArray(array) || !array.every((x) => typeof x === "number")) {
      throw new Error("Ошибка: передан некорректный массив чисел в SegmentTreeWasm.");
    }
    this.array = array.slice();
    this.modulePromise = createSegmentTreeModule().then((module: any) => {
      const vectorInt = new module.VectorInt();
      
      // Явно заполняем его значениями
      this.array.forEach((val) => vectorInt.push_back(val));
    
      // Передаём в C++
      module.setArray(vectorInt);
      
      // Вызов метода для построения дерева с правильными аргументами
      if (typeof module.buildTree === 'function') {
        module.buildTree(0, 0, this.array.length - 1);
        console.log("Дерево построено при инициализации.");
      } else {
        console.warn("Метод buildTree не найден в WASM модуле. Убедитесь, что дерево строится автоматически.");
      }
    
      // Очищаем вручную (иначе утечка памяти)
      vectorInt.delete();
      
      return module;
    });
  }

  // Метод setData с вызовом перестроения дерева
  async setData(newData: number[]): Promise<void> {
    const module = await this.modulePromise;
    const vectorInt = new module.VectorInt();
    newData.forEach((val) => vectorInt.push_back(val));
    module.setArray(vectorInt);
    
    // Вызов метода buildTree с необходимыми аргументами
    if (typeof module.buildTree === 'function') {
      module.buildTree(0, 0, newData.length - 1);
      console.log("Дерево перестроено с новыми данными.");
    } else {
      console.error("Метод buildTree не найден в WASM модуле.");
    }
    
    vectorInt.delete();
    this.array = newData.slice();
  }

  async update(index: number, value: number): Promise<void> {
    const module = await this.modulePromise;
    module.updateTree(0, 0, this.array.length - 1, index, value);
    this.array[index] += value;
  }

  async query(l: number, r: number): Promise<number> {
    const module = await this.modulePromise;
    return module.queryTree(0, 0, this.array.length - 1, l, r);
  }

  async getTreeForVisualization(): Promise<SegmentTreeNodeData[]> {
    const module = await this.modulePromise;
    
    const rawTreeVector = module.getTree();
    // Проверяем, есть ли у объекта `size` и `get`
    if (!rawTreeVector || typeof rawTreeVector.size !== "function" || typeof rawTreeVector.get !== "function") {
      console.error("Ошибка: `getTree()` вернул неподдерживаемый формат", rawTreeVector);
      return [];
    }

    // Преобразуем `VectorInt` в обычный массив `number[]`
    const rawTree: number[] = [];
    for (let i = 0; i < rawTreeVector.size(); i++) {
      rawTree.push(rawTreeVector.get(i));
    }

    console.log("Raw Tree after setData:", rawTree); // Логирование содержимого дерева

    const nodes: SegmentTreeNodeData[] = [];

    const buildVisualization = (
      node: number,
      start: number,
      end: number,
      x: number,
      y: number,
      spacingX: number,
      spacingY: number
    ): number => {
      const id = node; // Используем индекс узла как id
      const value = rawTree[node];
      const nodeData: SegmentTreeNodeData = {
        id,
        x,
        y,
        value,
        label: start === end ? `Index ${start}` : `${start}-${end}`,
        range: [start, end],
        children: []
      };
    
      if (start === end) {
        nodes.push(nodeData);
        return id;
      }
    
      const mid = Math.floor((start + end) / 2);
      const leftChild = 2 * node + 1;
      const rightChild = 2 * node + 2;
    
      const leftChildId = buildVisualization(
        leftChild,
        start,
        mid,
        x - spacingX / 2,
        y + spacingY,
        spacingX / 2,
        spacingY
      );
      const rightChildId = buildVisualization(
        rightChild,
        mid + 1,
        end,
        x + spacingX / 2,
        y + spacingY,
        spacingX / 2,
        spacingY
      );
    
      nodeData.children = [leftChildId, rightChildId];
      nodes.push(nodeData);
      return id;
    };

    buildVisualization(0, 0, this.array.length - 1, 400, 50, 300, 100);
    return nodes;
  }
}
