// SegmentTreeVisualizer.tsx
import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  setNewValue,
  setSelectedNode,
  setDelta,
  setSnackbar,
  updateTreeWithNewData,
} from "../store/segmentTreeSlice";
import { NotificationSnackbar } from "../../components/notificationSnackbar/NotificationSnackbar";
import { EditNodeModal } from "../visualisationComponents/nodeControls/editNodeModal/EditNodeModal";
import Header from "../components/Header";
import Controls from "../visualisationComponents/nodeControls/Controls";
import { SegmentTreeCanvas } from "../visualisationComponents/segmentTreeCanvas/SegmentTreeCanvas";
import Konva from "konva";
import { VisNode } from "../types/VisNode";

export const SegmentTreeVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const shapeRefs = useRef<Record<number, Konva.Circle>>({});

  const dispatch = useDispatch<AppDispatch>();
  const {
    data,
    nodes,
    parentMap,
    selectedNode,
    delta,
    newValue,
    snackbarOpen,
    snackbarMessage,
    stageSize,
  } = useSelector((state: RootState) => state.segmentTree);

  // При первом рендере создаём дерево с начальными данными (пример)
  useEffect(() => {
    dispatch(updateTreeWithNewData([5, 8, 6, 3, 2, 7, 2, 6]));
  }, [dispatch]);

  const handleAddElement = () => {
    if (newValue.trim() === "") {
      dispatch(setSnackbar({ message: "Введите значение для нового элемента.", open: true }));
      return;
    }
    const value = parseInt(newValue, 10);
    if (isNaN(value)) {
      dispatch(setSnackbar({ message: "Неверный формат числа.", open: true }));
      return;
    }
    if (data.length >= 16) {
      dispatch(setSnackbar({ message: "Максимальное число листьев (16) достигнуто.", open: true }));
      return;
    }
    const updatedData = [...data, value];
    dispatch(updateTreeWithNewData(updatedData)); // Полная перестройка
    dispatch(setNewValue(""));
  };

  const handleUpdateNode = () => {
    if (!selectedNode) {
      dispatch(setSnackbar({ message: "Выберите узел для обновления.", open: true }));
      return;
    }
    const [start, end] = selectedNode.range;
    if (start !== end) {
      dispatch(setSnackbar({ message: "Можно обновлять только листовые узлы.", open: true }));
      return;
    }
    const updatedData = [...data];
    updatedData[start] = delta; // Меняем значение листа
    dispatch(updateTreeWithNewData(updatedData)); // Полная перестройка

    dispatch(
      setSnackbar({
        message: `Значение узла [${start}, ${end}] обновлено до ${delta}`,
        open: true,
      })
    );
    dispatch(setSelectedNode(null));
  };

  const handleRemoveLeaf = () => {
    if (!selectedNode) {
      dispatch(setSnackbar({ message: "Выберите узел для удаления.", open: true }));
      return;
    }
    const [start, end] = selectedNode.range;
    if (start !== end) {
      dispatch(setSnackbar({ message: "Можно удалять только листовые узлы.", open: true }));
      return;
    }
    // Удаляем элемент массива, который соответствует листу [start, end]
    const updatedData = data.filter((_, idx) => idx !== start);
    // Вызываем полную перестройку сегментного дерева
    dispatch(updateTreeWithNewData(updatedData));
    dispatch(setSelectedNode(null));
  };

  const handleNodeClick = (node: VisNode) => {
    if (node.range[0] === node.range[1]) {
      dispatch(setSelectedNode(node));
      dispatch(setDelta(node.value));
    }
  };

  const handleCloseSnackbar = () => {
    dispatch(setSnackbar({ message: "", open: false }));
  };

  const modalPosition = { x: 100, y: 100 };
  const handleModalMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Можно реализовать логику перемещения модального окна, если нужно
  };

  return (
    <Box
      ref={containerRef}
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding="20px"
      boxSizing="border-box"
      bgcolor="#f8f9fa"
    >
      <Header />

      <Controls
        newValue={newValue}
        setNewValue={(val) => dispatch(setNewValue(val))}
        handleAddElement={handleAddElement}
        disabled={data.length >= 16}
        onUpdate={handleUpdateNode}
        onRemove={handleRemoveLeaf}
      />

      <SegmentTreeCanvas
        nodes={nodes}
        selectedNode={selectedNode}
        shapeRefs={shapeRefs}
        layerRef={layerRef}
        stageSize={stageSize}
        onNodeClick={handleNodeClick}
      />

      <EditNodeModal
        selectedNode={selectedNode}
        delta={delta}
        setDelta={(val) => dispatch(setDelta(val))}
        onUpdate={handleUpdateNode}
        onRemove={handleRemoveLeaf}
        position={modalPosition}
        onMouseDown={handleModalMouseDown}
      />

      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default SegmentTreeVisualizer;
