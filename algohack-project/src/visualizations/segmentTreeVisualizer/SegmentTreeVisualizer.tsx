// src/components/SegmentTreeVisualizer/SegmentTreeVisualizer.js
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import AddElementForm from "../../components/addElementForm/AddElementForm";
import NotificationSnackbar from "../../components/notificationSnackbar/NotificationSnackbar";
import EditNodeModal from "../../components/editNodeModal/EditNodeModal";
import SegmentTreeCanvas from "../visualisationComponents/SegmentTreeCanvas";
import useSegmentTree from "./UseSegmentTree";
import useDrag from "./UseDrag";

const SegmentTreeVisualizer = () => {
  // Initialize custom hooks
  const {
    data,
    setData,
    segmentTree,
    nodes,
    setNodes,
    parentMap,
    setParentMap,
    shapeRefs,
    handleAddElement,
    updateTreeWithNewData,
    refreshNodes,
    highlightPathFromLeaf,
  } = useSegmentTree([5, 8, 6, 3, 2, 7, 2, 6]);

  // Local state
  const [selectedNode, setSelectedNode] = useState(null);
  const [delta, setDelta] = useState(0);
  const [newValue, setNewValue] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Stage and modal dimensions
  const stageSize = { width: 800, height: 1200 };
  const modalSize = { width: 300, height: 200 };

  // Initialize drag hook
  const {
    position: editBoxPos,
    handleMouseDown: handleEditBoxMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDragging,
  } = useDrag({ x: 400, y: 300 }, stageSize, modalSize);

  // Attach global mouse events for dragging
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Define colors
  const circleColor = "#4B7BEC"; // Blue
  const highlightColor = "#FFC107"; // Bright Yellow
  const selectedColor = "#34B3F1"; // Light Blue
  const lineColor = "#9B59B6"; // Purple

  // Determine text color based on background
  const getTextColor = (fill) => {
    if (fill === highlightColor) return "#000"; // Black on yellow
    if (fill === selectedColor) return "#fff"; // White on light blue
    if (fill === circleColor) return "#fff"; // White on blue
    return "#fff"; // Default to white
  };

  // Handle node selection
  const handleNodeClick = (node) => {
    if (node.range[0] === node.range[1]) {
      setSelectedNode(node);
      setDelta(node.value); // Initialize delta with current value
    }
  };

  // Update selected node's value
  const handleUpdate = () => {
    if (!selectedNode) return;
    const [start, end] = selectedNode.range;
    if (start !== end) return; // Only leaves

    // Update the segment tree
    segmentTree.update(start, delta);

    // Refresh nodes to reflect changes
    refreshNodes(segmentTree);

    // Find the updated leaf node and highlight the path
    const updatedLeaf = nodes.find(
      (n) => n.range[0] === start && n.range[1] === end
    );
    if (updatedLeaf) {
      highlightPathFromLeaf(updatedLeaf.id, setNodes);
    }

    // Show success notification
    setSnackbarMessage(
      `Значение узла [${start},${end}] обновлено до ${delta}`
    );
    setSnackbarOpen(true);

    // Reset selected node
    setSelectedNode(null);
  };

  // Remove selected leaf node
  const handleRemoveLeaf = () => {
    if (selectedNode && selectedNode.range[0] === selectedNode.range[1]) {
      const pos = selectedNode.range[0];
      // Remove the leaf by updating the data
      const updatedData = [...data];
      updatedData.splice(pos, 1);
      setData(updatedData);
      updateTreeWithNewData(updatedData);
      setSelectedNode(null);
    }
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="start"
      padding="20px"
      boxSizing="border-box"
      bgcolor="#f8f9fa"
      style={{ position: "relative" }} // For absolute positioning of modal
    >
      <Typography variant="h4" marginBottom={2} sx={{ fontWeight: "bold" }}>
        Segment Tree Visualizer
      </Typography>

      <AddElementForm
        newValue={newValue}
        setNewValue={setNewValue}
        handleAddElement={handleAddElement}
      />

      <SegmentTreeCanvas
        nodes={nodes}
        shapeRefs={shapeRefs}
        handleNodeClick={handleNodeClick}
        circleColor={circleColor}
        highlightColor={highlightColor}
        selectedColor={selectedColor}
        getTextColor={getTextColor}
        leafStrokeWidth={2}
        internalNodeStrokeWidth={1}
        lineColor={lineColor}
      />

      {/* Edit Node Modal */}
      {selectedNode && (
        <EditNodeModal
          selectedNode={selectedNode}
          delta={delta}
          setDelta={setDelta}
          handleUpdate={handleUpdate}
          handleRemoveLeaf={handleRemoveLeaf}
          editBoxPos={editBoxPos}
          handleEditBoxMouseDown={handleEditBoxMouseDown}
          isDragging={isDragging}
        />
      )}

      {/* Snackbar for notifications */}
      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default SegmentTreeVisualizer;
