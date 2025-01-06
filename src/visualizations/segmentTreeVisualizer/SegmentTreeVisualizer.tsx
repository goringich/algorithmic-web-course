// src/segmentTreeVisualizer/SegmentTreeVisualizer.tsx

import React, { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Konva from "konva";
import SegmentTreeWasm from "../segmentTreeWasm"; 
import { useDrag } from "./UseDrag";
import { SegmentTreeCanvas } from "../visualisationComponents/segmentTreeCanvas/SegmentTreeCanvas";
import { AddElementForm } from "../visualisationComponents/addElementForm/AddElementForm";
import { NotificationSnackbar } from "../../components/notificationSnackbar/NotificationSnackbar";
import { EditNodeModal } from "../visualisationComponents/editNodeModal/EditNodeModal";
import useHighlightPath from '../visualisationComponents/highlightPathFromLeaf/useHighlightPath';
import { buildParentMap, animateNodeMove, animateNodeAppear, animateNodeDisappear } from '../visualisationComponents/nodeAnimations/NodeAnimations'; // Импортируем функции

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

const MAX_LEAVES = 16;

export default function SegmentTreeVisualizer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shapeRefs = useRef<Record<string, Konva.Circle>>({});
  const [stageSize, setStageSize] = useState({ width: 1200, height: 1200 });

  // Использование нового хука
  const [data, setData] = useState([5, 8, 6, 3, 2, 7, 2, 6]);
  const [segmentTree, setSegmentTree] = useState<SegmentTreeWasm | null>(null);

  // Хранение узлов для отображения
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

  // Инициализация хука подсветки с передачей nodes
  const highlightPathFromLeaf = useHighlightPath({ nodes, parentMap, setNodes });

  // 1) При первом рендере создаём WASM-обёртку и строим дерево
  useEffect(() => {
    const st = new SegmentTreeWasm(data);
    setSegmentTree(st);

    (async () => {
      const initialNodes = await st.getTreeForVisualization();
      // console.log("Полученные узлы:", initialNodes); 
      // console.log("Полученные узлы:", JSON.stringify(initialNodes, null, 2));
      setNodes(initialNodes);
      setParentMap(buildParentMap(initialNodes));
      // console.log('Инициализированные узлы:', initialNodes);
    })();
  }, [data]);

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
  // Функция для перестроения дерева
  const updateTreeWithNewData = async (newData: number[]) => {
    setData(newData);

    const st = new SegmentTreeWasm(newData);
    setSegmentTree(st);

    await refreshNodes(st);
  };

  // --------------------------------------------------------------------------------------------
  // Обновляем nodes и parentMap через вызов st.getTreeForVisualization()
  const refreshNodes = async (st: SegmentTreeWasm) => {
    const newVisNodes = await st.getTreeForVisualization();
    console.log('Обновлённые узлы:', newVisNodes);
  
    let newParentMap = buildParentMap(newVisNodes);

    // Проверяем узлы, у которых нет родителя в newParentMap
    const orphanNodes = newVisNodes.filter(node => !newParentMap[node.id]);
    if (orphanNodes.length > 0) {
      console.warn("Orphan nodes detected, fixing structure.", orphanNodes);
  
      // Присоединяем сиротские узлы к первому узлу дерева (или к главному корню)
      orphanNodes.forEach(node => {
        newParentMap[node.id] = newVisNodes[0].id;
      });
    }

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
        }, 50);
      }
    });

    // Обновляем parentMap и nodes
    setParentMap(newParentMap);
    setNodes(newVisNodes);
    console.log("Final fixed parentMap after refresh:", newParentMap);
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
  // Обновление значения выбранного листа
  const handleUpdate = async () => {
    if (!selectedNode || !segmentTree) return;
    const [start, end] = selectedNode.range;
    if (start !== end) return;

    // вызываем WASM update(index, value)
    await segmentTree.update(start, delta);

    // затем перестраиваем визуализацию
    await refreshNodes(segmentTree);

    // Найти обновлённый узел после перестроения дерева
    const updatedNodes = await segmentTree.getTreeForVisualization();
    setNodes(updatedNodes);
    setParentMap(buildParentMap(updatedNodes)); // Обновить parentMap

    const leafNode = updatedNodes.find(
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
  // Удаление выбранного листа
  const handleRemoveLeaf = async () => {
    if (!selectedNode) return;
    const [start, end] = selectedNode.range;
    if (start !== end) return;

    const pos = selectedNode.range[0];
    // Анимация исчезновения
    animateNodeDisappear(selectedNode.id, shapeRefs.current, async () => {
      const newArr = [...data];
      newArr.splice(pos, 1);
      await updateTreeWithNewData(newArr);
    });
    setSelectedNode(null);
  };

  // --------------------------------------------------------------------------------------------
  // Обработчик клика по узлу
  const handleNodeClick = (node: VisNode) => {
    // Только листы
    if (node.range[0] === node.range[1]) {
      setSelectedNode(node);
      setDelta(node.value);
    }
  };

  // --------------------------------------------------------------------------------------------
  // Обработчики Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // --------------------------------------------------------------------------------------------
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

  if (!segmentTree) return <div>Loading...</div>;

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

      {/* Временный компонент для отладки структуры дерева */}
      {/* Удалите его после завершения отладки */}
      <Box mt={4} width="80%">
        <Typography variant="h6">Tree Structure (parentMap)</Typography>
        <pre>{JSON.stringify(parentMap, null, 2)}</pre>
      </Box>
    </Box>
  );
}
