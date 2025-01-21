import React, { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useDrag } from "../../components/UseDrag";
import { NotificationSnackbar } from "../../../components/notificationSnackbar/NotificationSnackbar";
import { EditNodeModal } from "../../visualisationComponents/nodeControls/editNodeModal/EditNodeModal";
import useHighlightPath from "../../visualisationComponents/highlightPathFromLeaf/hooks/useHighlightPath";
import { VisNode } from "../../visualisationComponents/nodeAnimations/types/VisNode";
import Header from "../../components/Header";
import Controls from "../../components/Controls";
import TreeArea from "../../components/TreeArea";
import TreeStructure from "../../visualisationComponents/segmentTreeNode/treeStructure/TreeStructure";
import { useSegmentTreeContext } from "../common/context/segmentTreeContext/SegmentTreeContext"
import Konva from "konva";

const SegmentTreeVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    nodes,
    parentMap,
    data,
    snackbarOpen,
    snackbarMessage,
    newValue,
    setNewValue,
    onAddElement,
    onUpdateNode,
    onRemoveLeaf,
    onNodeClick,
    onCloseSnackbar,
    shapeRefs,
    editBoxPos,
    handleEditBoxMouseDown,
    handleEditBoxMouseMove,
    handleEditBoxMouseUp,
    stageSize,

    selectedNode,
    setDelta,
    delta,

    setStageSize
  } = useSegmentTreeContext();

  // Константы стилей
  const circleColor = "#4B7BEC";
  const highlightColor = "#FFC107";
  const selectedColor = "#34B3F1";
  const lineColor = "#9B59B6";
  const leafStrokeWidth = 2;
  const internalNodeStrokeWidth = 1;

  const getTextColor = (fill: string): string => {
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
        handleAddElement={onAddElement}
        disabled={data.length >= 16} // Используем MAX_LEAVES из провайдера
        onUpdate={onUpdateNode}
        onRemove={onRemoveLeaf}
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
        onNodeClick={onNodeClick}
        shapeRefs={shapeRefs}
        data={data}
        parentMap={parentMap}
      />

      <EditNodeModal
        selectedNode={selectedNode}
        delta={delta}
        setDelta={setDelta}
        onUpdate={onUpdateNode}
        onRemove={onRemoveLeaf}
        position={editBoxPos}
        onMouseDown={handleEditBoxMouseDown}
      />

      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={onCloseSnackbar}
      />

      <TreeStructure parentMap={parentMap} />
    </Box>
  );
};

export default SegmentTreeVisualizer;
