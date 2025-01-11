import React, { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDrag } from "./components/UseDrag";
import { NotificationSnackbar } from "../../components/notificationSnackbar/NotificationSnackbar";
import { EditNodeModal } from "../visualisationComponents/nodeControls/editNodeModal/EditNodeModal";
import useHighlightPath from '../visualisationComponents/highlightPathFromLeaf/useHighlightPath';
import { VisNode } from '../visualisationComponents/nodeAnimations/types/VisNode';
import Header from './components/Header';
import Controls from './components/Controls';
import TreeArea from './components/TreeArea';
import useSegmentTree from './useSegmentTree/UseSegmentTree'; 
import { animateNodeDisappear } from '../visualisationComponents/nodeAnimations/nodeAnimations'; 
import TreeStructure from "../visualisationComponents/treeStructure/TreeStructure";

const MAX_LEAVES = 16;

export default function SegmentTreeVisualizer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shapeRefs = useRef<Record<string, Konva.Circle>>({});
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

  // кастомный хук для управления деревом
  const { nodes, parentMap, updateTreeWithNewData, setNodes, setParentMap } = useSegmentTree({ initialData: data, shapeRefs });

  // Инициализация хука подсветки с передачей nodes
  const highlightPathFromLeaf = useHighlightPath({ nodes, parentMap, setNodes });

  // новый элемент
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
    setData(updatedData);
    setNewValue("");
  };

  // обновляем значение листа
  const handleUpdate = async () => {
    if (!selectedNode) return;
    const [start, end] = selectedNode.range;
    if (start !== end) return;
  
    const updatedData = [...data];
    updatedData[start] = delta;
    setData(updatedData);
  
    await updateTreeWithNewData(updatedData);
  
    setTimeout(() => {
      const leafNode = nodes.find(n => n.range[0] === start && n.range[1] === end);
      if (!leafNode) {
        console.error(`Leaf node for range [${start}, ${end}] not found.`);
        return;
      }
  
      if (Object.keys(parentMap).length === 0) {
        console.warn("Skipping highlight: parentMap is empty.");
        return;
      }
  
      highlightPathFromLeaf(leafNode.id);
    }, 50);
  
    setSnackbarMessage(`Значение узла [${start},${end}] обновлено до ${delta}`);
    setSnackbarOpen(true);
    setSelectedNode(null);
  };
  

  const handleRemoveLeaf = async () => {
    if (!selectedNode) return;
    const [start, end] = selectedNode.range;
    if (start !== end) return;

    const pos = selectedNode.range[0];

    animateNodeDisappear(selectedNode.id, shapeRefs.current, async () => {
      const newArr = [...data];
      newArr.splice(pos, 1);
      await updateTreeWithNewData(newArr);
      setData(newArr); 
    });
    setSelectedNode(null);
  };

  const handleNodeClick = (node: VisNode) => {
    // только листы
    if (node.range[0] === node.range[1]) {
      setSelectedNode(node);
      setDelta(node.value);
    }
  };

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
        handleAddElement={handleAddElement}
        disabled={data.length >= MAX_LEAVES}
      />

      <TreeArea
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

      <TreeStructure parentMap={parentMap}/>
    </Box>
  );
}
