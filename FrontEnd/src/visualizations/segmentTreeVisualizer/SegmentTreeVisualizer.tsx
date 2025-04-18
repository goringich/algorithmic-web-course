import React, { useState, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  setNewValue,
  setSelectedNode,
  setDelta,
  updateTreeWithNewData,
  setSnackbar
} from "../store/slices/segmentTreeSlice";
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
import useStepHighlightPath from "../visualisationComponents/animations/highlightPathFromLeaf/hooks/useStepHighlightPath";

export const SegmentTreeVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shapeRefs = useRef<Record<number, Konva.Circle>>({});
  const { initHighlightPath, nextStep, previousStep, finishAnimation, clearAnimation, currentStep, totalSteps } = useStepHighlightPath();
  const dispatch = useDispatch<AppDispatch>();
  const {
    data,
    nodes,
    selectedNode,
    delta,
    newValue,
    snackbarOpen,
    snackbarMessage,
    stageSize,
    highlightedNodes
  } = useSelector((state: RootState) => state.segmentTree);
  
  const nodesWithHighlight = nodes.map((n) => ({
    ...n,
    isHighlighted: highlightedNodes.includes(n.id)
  }));

  useEffect(() => {
    console.log("[DEBUG] Обновлённые подсвеченные узлы:", highlightedNodes);
  }, [highlightedNodes]);
  
  const isTreeInitialized = useRef(false);
  useEffect(() => {
    if (!isTreeInitialized.current) {
      dispatch(updateTreeWithNewData([5, 8, 6, 3, 2, 7, 2, 6]));
      isTreeInitialized.current = true;
    }
  }, [dispatch]);
  
  const MAX_LEAVES = 16;

  const onNodeClick = (node: VisNode) => {
    handleNodeClick(node, dispatch);
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
    await handleUpdateNode(selectedNode, delta, data, dispatch);
    if (selectedNode) {
      initHighlightPath(selectedNode.id);
    }
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
        onAdd={onAddElement}
        disabled={data.length >= MAX_LEAVES}
      />
      <SegmentTreeCanvas
        nodes={nodesWithHighlight}
        shapeRefs={shapeRefs}
        stageSize={stageSize}
        onNodeClick={onNodeClick}
        highlightedNodes={highlightedNodes}
      />
      <Box display="flex" gap="10px" marginTop="20px">
        <Button variant="contained" onClick={previousStep} disabled={currentStep <= 1}>
          Назад
        </Button>
        <Button variant="contained" onClick={nextStep} disabled={currentStep >= totalSteps}>
          Вперёд
        </Button>
        <Button variant="contained" onClick={finishAnimation} disabled={currentStep >= totalSteps}>
          Закончить анимацию
        </Button>
        <Button variant="contained" onClick={clearAnimation} disabled={currentStep === 0}>
          Снять анимацию
        </Button>
      </Box>
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
