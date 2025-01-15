// src/visualizations/SegmentTreeVisualizer.tsx
import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import { useDrag } from "../../components/UseDrag";
import { NotificationSnackbar } from "../../../components/notificationSnackbar/NotificationSnackbar";
import { EditNodeModal } from "../../visualisationComponents/nodeControls/editNodeModal/EditNodeModal";
import useHighlightPath from "../../visualisationComponents/highlightPathFromLeaf/hooks/useHighlightPath";
import { VisNode } from "../../visualisationComponents/nodeAnimations/types/VisNode";
import Header from '../../components/Header';
import Controls from '../../components/Controls';
import TreeArea from '../../components/TreeArea';
import { animateNodeDisappear } from '../../visualisationComponents/nodeAnimations/nodeAnimations'; 
import TreeStructure from "../../visualisationComponents/segmentTreeNode/treeStructure/TreeStructure";
import { SegmentTreeProvider } from "../common/context/SegmentTreeProvider";

const MAX_LEAVES = 16;

export default function SegmentTreeVisualizer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  // Функции для управления деревом (handleAddElement, handleUpdate, handleRemoveLeaf, handleNodeClick, handleCloseSnackbar)
  
  // Добавление нового элемента
  const handleAddElement = async (updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>, setData: React.Dispatch<React.SetStateAction<number[]>>) => {
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

    // Получаем текущие данные из контекста
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
  const handleUpdate = async (
    selectedNode: VisNode | null,
    delta: number,
    data: number[],
    setData: React.Dispatch<React.SetStateAction<number[]>>,
    updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>,
    parentMap: Record<number, number>,
    highlightPathFromLeaf: (leafId: number) => void,
    setSelectedNode: React.Dispatch<React.SetStateAction<VisNode | null>>,
    setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>,
    setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
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
  const handleRemoveLeaf = async (
    selectedNode: VisNode | null,
    data: number[],
    setData: React.Dispatch<React.SetStateAction<number[]>>,
    updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>,
    shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>,
    setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>,
    setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedNode: React.Dispatch<React.SetStateAction<VisNode | null>>
  ) => {
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
  const handleNodeClick = (node: VisNode, setSelectedNode: React.Dispatch<React.SetStateAction<VisNode | null>>, setDelta: React.Dispatch<React.SetStateAction<number>>) => {
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
    <SegmentTreeProvider initialData={data}>
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
          handleAddElement={() => handleAddElement}
          disabled={data.length >= MAX_LEAVES}
        />

        <TreeArea
          selectedNodeId={selectedNode?.id || null}
          stageSize={stageSize}
          circleColor={circleColor}
          highlightColor={highlightColor}
          selectedColor={selectedColor}
          lineColor={lineColor}
          leafStrokeWidth={leafStrokeWidth}
          internalNodeStrokeWidth={internalNodeStrokeWidth}
          getTextColor={getTextColor}
          onNodeClick={(node: VisNode) => handleNodeClick(node, setSelectedNode, setDelta)}
        />

        <EditNodeModal
          selectedNode={selectedNode}
          delta={delta}
          setDelta={setDelta}
          onUpdate={() => handleUpdate(selectedNode, delta, data, setData, updateTreeWithNewData, parentMap, useHighlightPath, setSelectedNode, setSnackbarMessage, setSnackbarOpen)}
          onRemove={() => handleRemoveLeaf(selectedNode, data, setData, updateTreeWithNewData, shapeRefs, setSnackbarMessage, setSnackbarOpen, setSelectedNode)}
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
    </SegmentTreeProvider>
  );
}
