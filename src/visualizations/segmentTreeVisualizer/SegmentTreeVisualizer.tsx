import React, { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Konva from "konva";
import SegmentTreeWasm from "../segmentTreeWasm"; 
import { useDrag } from "./UseDrag";
import { SegmentTreeCanvas } from "../visualisationComponents/SegmentTreeCanvas";
import { AddElementForm } from "../../components/addElementForm/AddElementForm";
import { NotificationSnackbar } from "../../components/notificationSnackbar/NotificationSnackbar";
import { EditNodeModal } from "../../components/editNodeModal/EditNodeModal";

interface VisNode {
  id: string;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children: string[];
  isHighlighted?: boolean;
}

const MAX_LEAVES = 16;

export default function SegmentTreeVisualizer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shapeRefs = useRef<Record<string, Konva.Circle>>({});
  const [stageSize, setStageSize] = useState({ width: 800, height: 1200 });

  // === Теперь вместо useSegmentTree ===
  const [data, setData] = useState([5, 8, 6, 3, 2, 7, 2, 6]);
  const [segmentTree, setSegmentTree] = useState<SegmentTreeWasm | null>(null);

  // Храним узлы для отображения
  const [nodes, setNodes] = useState<VisNode[]>([]);
  // parentMap — карта childId -> parentId
  const [parentMap, setParentMap] = useState<Record<string, string>>({});

  const [newValue, setNewValue] = useState("");
  const [selectedNode, setSelectedNode] = useState<VisNode | null>(null);
  const [delta, setDelta] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const {
    position: editBoxPos,
    handleMouseDown: handleEditBoxMouseDown,
    handleMouseMove: handleEditBoxMouseMove,
    handleMouseUp: handleEditBoxMouseUp
  } = useDrag(400, 300);

  // 1) При первом рендере создаём WASM-обёртку и строим дерево
  useEffect(() => {
    const st = new SegmentTreeWasm(data);
    setSegmentTree(st);

    (async () => {
      const initialNodes = await st.getTreeForVisualization();
      setNodes(initialNodes);
      setParentMap(buildParentMap(initialNodes));
    })();
  }, []);

  // 2) При ресайзе холста
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        setStageSize({ width: clientWidth, height: 1200 });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --------------------------------------------------------------------------------------------
  // Helpers
  const buildParentMap = (newNodes: VisNode[]) => {
    const map: Record<string, string> = {};
    for (const node of newNodes) {
      for (const childId of node.children) {
        map[childId] = node.id;
      }
    }
    return map;
  };

  const animateNodeMove = (nodeId: string, newX: number, newY: number) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) return;
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      x: newX,
      y: newY,
      easing: Konva.Easings.EaseInOut
    }).play();
  };

  const animateNodeAppear = (nodeId: string, finalX: number, finalY: number) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) return;
    shape.scale({ x: 0, y: 0 });
    shape.y(finalY - 50);
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      scaleX: 1,
      scaleY: 1,
      y: finalY,
      easing: Konva.Easings.EaseOut
    }).play();
  };

  const animateNodeDisappear = (nodeId: string, callback?: () => void) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) {
      if (callback) callback();
      return;
    }
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      scaleX: 0,
      scaleY: 0,
      easing: Konva.Easings.EaseIn,
      onFinish: () => {
        if (callback) callback();
      }
    }).play();
  };

  // --------------------------------------------------------------------------------------------
  // Функция для «перестроения» (rebuild) дерева: создаёт новый ST, либо обновляет (по желанию),
  // и вызывает refreshNodes(...) для анимаций
  const updateTreeWithNewData = async (newData: number[]) => {
    setData(newData);

    const st = new SegmentTreeWasm(newData);
    setSegmentTree(st);

    await refreshNodes(st);
  };

  // --------------------------------------------------------------------------------------------
  // Обновляем nodes через вызов st.getTreeForVisualization()
  const refreshNodes = async (st: SegmentTreeWasm) => {
    const newVisNodes = await st.getTreeForVisualization();

    // 1) Анимация исчезновения для узлов, которых нет в newVisNodes
    setNodes((prev) => {
      const removed = prev.filter(
        (oldNode) => !newVisNodes.some((n) => n.id === oldNode.id)
      );
      removed.forEach((rn) => animateNodeDisappear(rn.id));
      return prev;
    });

    // 2) Обновляем state "nodes" и анимируем перемещение / появление
    setNodes((prevNodes) => {
      newVisNodes.forEach((newN) => {
        const oldNode = prevNodes.find((p) => p.id === newN.id);
        if (oldNode) {
          if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
            animateNodeMove(newN.id, newN.x, newN.y);
          }
        } else {
          setTimeout(() => {
            animateNodeAppear(newN.id, newN.x, newN.y);
          }, 50);
        }
      });
      return newVisNodes;
    });

    // 3) Обновляем parentMap
    const map = buildParentMap(newVisNodes);
    setParentMap(map);
  };

  // --------------------------------------------------------------------------------------------
  // Добавление нового элемента
  const handleAddElement = async () => {
    if (newValue === "") return;
    const value = parseInt(newValue, 10);
    if (isNaN(value)) return;

    if (data.length >= MAX_LEAVES) {
      alert("Превышен лимит (16) листьев.");
      setNewValue("");
      return;
    }

    const updatedData = [...data, value];
    await updateTreeWithNewData(updatedData);
    setNewValue("");
  };

  // --------------------------------------------------------------------------------------------
  // Подсветка пути (highlight) от листа к корню
  const highlightPathFromLeaf = (leafNodeId: string) => {
    let currentId: string | undefined = leafNodeId;
    let prevId: string | null = null;
    setNodes((old) => old.map((n) => ({ ...n, isHighlighted: false })));
    const pathIds: string[] = [];

    while (currentId) {
      pathIds.push(currentId);
      const pId = parentMap[currentId];
      if (!pId || pId === currentId) break;
      currentId = pId;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (prevId) {
        setNodes((old) =>
          old.map((node) =>
            node.id === prevId ? { ...node, isHighlighted: false } : node
          )
        );
      }
      if (i < pathIds.length) {
        const currentHighlightId = pathIds[i];
        setNodes((old) =>
          old.map((node) =>
            node.id === currentHighlightId ? { ...node, isHighlighted: true } : node
          )
        );
        prevId = currentHighlightId;
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (prevId) {
            setNodes((old) =>
              old.map((node) =>
                node.id === prevId ? { ...node, isHighlighted: false } : node
              )
            );
          }
        }, 800);
      }
    }, 800);
  };

  // --------------------------------------------------------------------------------------------
  // Обновляем значение выбранного листа
  const handleUpdate = async () => {
    if (!selectedNode || !segmentTree) return;
    const [start, end] = selectedNode.range;
    if (start !== end) return;

    // вызываем WASM update(index, value)
    await segmentTree.update(start, delta);

    // затем перестраиваем визуализацию
    await refreshNodes(segmentTree);

    const leafNode = nodes.find(
      (n) => n.range[0] === start && n.range[1] === end
    );
    if (leafNode) {
      highlightPathFromLeaf(leafNode.id);
    }

    setSnackbarMessage(`Значение узла [${start},${end}] обновлено до ${delta}`);
    setSnackbarOpen(true);
    setSelectedNode(null);
  };

  // --------------------------------------------------------------------------------------------
  // Удаляем выбранный лист
  const handleRemoveLeaf = async () => {
    if (!selectedNode) return;
    const [start, end] = selectedNode.range;
    if (start !== end) return;

    const pos = selectedNode.range[0];
    // Анимация исчезновения
    animateNodeDisappear(selectedNode.id, async () => {
      const newArr = [...data];
      newArr.splice(pos, 1);
      await updateTreeWithNewData(newArr);
    });
    setSelectedNode(null);
  };

  // --------------------------------------------------------------------------------------------
  // Клик по узлу
  const handleNodeClick = (node: VisNode) => {
    // только лист
    if (node.range[0] === node.range[1]) {
      setSelectedNode(node);
      setDelta(node.value);
    }
  };

  // --------------------------------------------------------------------------------------------
  // Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // --------------------------------------------------------------------------------------------
  // Стиль
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
      <Typography variant="h4" marginBottom={2} sx={{ fontWeight: "bold" }}>
        Segment Tree Visualizer (WASM)
      </Typography>

      <AddElementForm
        newValue={newValue}
        onChangeValue={setNewValue}
        onAdd={handleAddElement}
        disabled={data.length >= MAX_LEAVES}
      />

      <SegmentTreeCanvas
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
    </Box>
  );
}
