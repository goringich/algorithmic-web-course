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
import Controls from "../visualisationComponents/nodeControls/Controls";
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

  
  const [animatedNodes, setAnimatedNodes] = useState<VisNode[]>(nodes);

  
  useEffect(() => {
    setAnimatedNodes((prev) =>
      nodes.map((n) => {
        const old = prev.find((p) => p.id === n.id);
        return {
          ...n,
          
          isHighlighted: old ? old.isHighlighted : false,
        };
      })
    );
  }, [nodes]);

  
  useEffect(() => {
    dispatch(updateTreeWithNewData([5, 8, 6, 3, 2, 7, 2, 6]));
  }, [dispatch]);

  const MAX_LEAVES = 16;

  
  const highlightPathFromLeaf = useHighlightPath({
    nodes: animatedNodes,
    parentMap,
    setNodes: setAnimatedNodes,
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
        handleAddElement={onAddElement}
        disabled={data.length >= MAX_LEAVES}
        onUpdate={onUpdateNode}
        onRemove={onRemoveLeaf}
      />

      <SegmentTreeCanvas
        nodes={animatedNodes} 
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
