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
import { useSegmentTreeContext } from "../common/context/SegmentTreeProvider";
import Konva from "konva";

import {
  handleAddElement,
  handleUpdateNode,
  handleRemoveLeaf,
  handleNodeClick,
  handleCloseSnackbar,
  buildSegmentTree,
  updateTreeWithNewData,
} from "./handlers/segmentTreeHandlers";

const MAX_LEAVES = 16;

export default function SegmentTreeVisualizer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shapeRefs = useRef<Record<string, Konva.Circle>>({});

  const [stageSize, setStageSize] = useState({ width: 1200, height: 500 });
  const [data, setData] = useState<number[]>([5, 8, 6, 3, 2, 7, 2, 6]);
  const [selectedNode, setSelectedNode] = useState<VisNode | null>(null);
  const [delta, setDelta] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");

  const {
    position: editBoxPos,
    handleMouseDown: handleEditBoxMouseDown,
    handleMouseMove: handleEditBoxMouseMove,
    handleMouseUp: handleEditBoxMouseUp,
  } = useDrag(400, 300);

  const { nodes, parentMap, setNodes, setParentMap } = useSegmentTreeContext();
  const highlightPathFromLeaf = useHighlightPath({
    nodes,
    parentMap,
    setNodes,
  });

  useEffect(() => {
    console.log("Data updated:", data);
    const visNodes = buildSegmentTree(data);

    console.log("Built VisNodes:", visNodes);
    const newParentMap: Record<number, number> = {};

    visNodes.forEach((node) => {
      if (node.parentId !== undefined) {
        newParentMap[node.id] = node.parentId;
      }
    });
    setParentMap(newParentMap);
  }, [data, setParentMap]);

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
        handleAddElement={() =>
          handleAddElement({
            newValue,
            setNewValue,
            data,
            setData,
            setSnackbarMessage,
            setSnackbarOpen,
            MAX_LEAVES,
            updateTreeWithNewData,
            buildSegmentTree,
            setParentMap,
          })
        } // Передача необходимых параметров
        disabled={data.length >= MAX_LEAVES}
        onUpdate={() =>
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
            updateTreeWithNewData,
          })
        }
        onRemove={() =>
          handleRemoveLeaf({
            selectedNode,
            setSelectedNode,
            data,
            setData,
            setSnackbarMessage,
            setSnackbarOpen,
            parentMap,
            updateTreeWithNewData,
            shapeRefs,
          })
        }
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
        onNodeClick={(node: VisNode) =>
          handleNodeClick({
            node,
            setSelectedNode,
            setDelta,
          })
        }
        shapeRefs={shapeRefs}
        data={data}
        parentMap={parentMap}
      />

      <EditNodeModal
        selectedNode={selectedNode}
        delta={delta}
        setDelta={setDelta}
        onUpdate={() =>
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
            updateTreeWithNewData,
          })
        }
        onRemove={() =>
          handleRemoveLeaf({
            selectedNode,
            setSelectedNode,
            data,
            setData,
            setSnackbarMessage,
            setSnackbarOpen,
            parentMap,
            updateTreeWithNewData,
            shapeRefs,
          })
        }
        position={editBoxPos}
        onMouseDown={handleEditBoxMouseDown}
      />

      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => handleCloseSnackbar({ setSnackbarOpen })}
      />

      <TreeStructure parentMap={parentMap} />
    </Box>
  );
}
