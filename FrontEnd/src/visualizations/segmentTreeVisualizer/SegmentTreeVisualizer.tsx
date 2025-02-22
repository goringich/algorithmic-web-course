import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  setNewValue,
  setSelectedNode,
  setDelta,
  updateTreeWithNewData,
  setSnackbar,
} from "../store/segmentTreeSlice";
import { NotificationSnackbar } from "../../components/notificationSnackbar/NotificationSnackbar";
import { EditNodeModal } from "../visualisationComponents/nodeControls/editNodeModal/EditNodeModal";
import Header from "../components/Header";
import { AddElementForm } from "../visualisationComponents/nodeControls/addElementForm/AddElementForm";
import { SegmentTreeCanvas } from "../visualisationComponents/segmentTreeCanvas/SegmentTreeCanvas";
import Konva from "konva";
import { VisNode } from "../types/VisNode";

import { handleNodeClick } from "./utils/handlers/handleNodeClick";
import { handleCloseSnackbar } from "./utils/handlers/handleCloseSnackbar";
import { handleAddElement } from "./utils/handlers/handleAddElement";
import { handleRemoveLeaf } from "./utils/handlers/handleRemoveLeaf";
import { handleUpdateNode } from "./utils/handlers/handleUpdateNode";
import useHighlightPath from "../visualisationComponents/animations/highlightPathFromLeaf/hooks/useHighlightPath";

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

  // Локальное состояние для хранения id выделённых узлов (highlighted — подсвеченных)
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);
  // Объединяем данные из Redux с информацией о выделении
  const nodesWithHighlight = nodes.map((n) => ({
    ...n,
    isHighlighted: highlightedNodes.includes(n.id),
  }));

  useEffect(() => {
    dispatch(updateTreeWithNewData([5, 8, 6, 3, 2, 7, 2, 6]));
  }, [dispatch]);

  const MAX_LEAVES = 16;

  const highlightPathFromLeaf = useHighlightPath({
    nodes,
    parentMap,
    setHighlightedNodes,
  });

  const onNodeClick = (node: VisNode) => {
    handleNodeClick(node, dispatch);
    if (node.range[0] === node.range[1]) {
      highlightPathFromLeaf(node.id);
    }
  };

  const onCloseSnackbar = () => {
    handleCloseSnackbar(dispatch);
  };

  const onAddElement = async () => {
    await handleAddElement(newValue, MAX_LEAVES, dispatch, data);
  };  

  const onRemoveLeaf = async () => {
    await handleRemoveLeaf(selectedNode, data, dispatch, shapeRefs);
    handleCloseModal(); 
  };

  const onUpdateNode = async () => {
    await handleUpdateNode(
      selectedNode,
      delta,
      data,
      dispatch,
      highlightPathFromLeaf,
      parentMap
    );
    handleCloseModal(); 
  };

  const handleCloseModal = () => {
    dispatch(setSelectedNode(null)); 
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

      <AddElementForm
        newValue={newValue}
        onChangeValue={(val) => dispatch(setNewValue(Number(val) || 0))}
        onAdd={onAddElement} // 🔹 Передаём функцию в AddElementForm
        disabled={data.length >= MAX_LEAVES}
      />

      <SegmentTreeCanvas
        nodes={nodesWithHighlight}
        shapeRefs={shapeRefs}
        layerRef={layerRef}
        stageSize={stageSize}
        onNodeClick={onNodeClick}
      />

      <EditNodeModal
        selectedNode={selectedNode}
        delta={delta}
        setDelta={(val) => dispatch(setDelta(val))}
        onUpdate={onUpdateNode}
        onRemove={onRemoveLeaf}
        position={{ x: 100, y: 100 }}
        onClose={handleCloseModal} 
      />

      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={onCloseSnackbar}
      />
    </Box>
  );
};

export default SegmentTreeVisualizer;
