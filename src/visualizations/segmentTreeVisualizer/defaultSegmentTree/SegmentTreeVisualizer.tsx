// src/visualizations/SegmentTreeVisualizer.tsx

import React, { useRef, useState, useEffect } from "react";
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
import { SegmentTreeProvider, useSegmentTreeContext } from "../common/context/SegmentTreeProvider";
import Konva from "konva"; // Ensure Konva is installed and imported

const MAX_LEAVES = 16;

// Placeholder for the actual tree-building logic
const buildSegmentTree = (data: number[]): VisNode[] => {
  // Implement your actual segment tree construction here
  // This is a simplified example
  const leaves: VisNode[] = data.map((value, index) => ({
    id: index,
    value,
    range: [index, index],
    parentId: Math.floor((index - 1) / 2), // Example parent calculation
  }));
  // Add internal nodes as needed
  return leaves;
};

export default function SegmentTreeVisualizer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shapeRefs = useRef<Record<string, Konva.Circle>>({}); // Reference to node shapes for animations

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
    handleMouseUp: handleEditBoxMouseUp
  } = useDrag(400, 300);

  const highlightPathFromLeaf = useHighlightPath(); // Assuming this hook returns a function

  const [parentMap, setParentMap] = useState<Record<number, number>>({}); // Mapping from node ID to parent ID

  // Effect to build the initial tree and parentMap
  useEffect(() => {
    console.log("Data updated:", data);
    const visNodes = buildSegmentTree(data);
    console.log("Built VisNodes:", visNodes);
    const newParentMap: Record<number, number> = {};
    visNodes.forEach(node => {
      if (node.parentId !== undefined) {
        newParentMap[node.id] = node.parentId;
      }
    });
    setParentMap(newParentMap);
  }, [data]);

  // Function to update the tree with new data
  const updateTreeWithNewData = async (newData: number[]): Promise<VisNode[] | null> => {
    console.log("Adding element:", newValue);
    const newVisNodes = buildSegmentTree(newData);
    if (newVisNodes) {
      const newParentMap: Record<number, number> = {};
      newVisNodes.forEach(node => {
        if (node.parentId !== undefined) {
          newParentMap[node.id] = node.parentId;
        }
      });
      setParentMap(newParentMap);
      return newVisNodes;
    }
    return null;
  };

  // Adding a new element to the tree
  const handleAddElement = async () => {
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

    if (data.length >= MAX_LEAVES) {
      setSnackbarMessage(`Максимальное количество листьев (${MAX_LEAVES}) достигнуто.`);
      setSnackbarOpen(true);
      return;
    }

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

  // Updating a leaf node's value
  const handleUpdateNode = async () => {
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

  // Removing a leaf node
  const handleRemoveLeaf = async () => {
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

    // Ensure animateNodeDisappear is correctly implemented and imported
    await animateNodeDisappear(selectedNode.id, shapeRefs.current);

    const newArr = [...data];
    newArr.splice(pos, 1);
    const newVisNodes = await updateTreeWithNewData(newArr);
    if (!newVisNodes) {
      setSnackbarMessage("Ошибка при удалении узла.");
      setSnackbarOpen(true);
      return;
    }
    setData(newArr);
    setSelectedNode(null);
  };

  // Handling node click
  const handleNodeClick = (node: VisNode) => {
    // Только листы
    if (node.range[0] === node.range[1]) {
      setSelectedNode(node);
      setDelta(node.value);
    }
  };

  // Closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Styling constants
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
    <SegmentTreeProvider>
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
          handleAddElement={handleAddElement} // Correctly passing the function
          disabled={data.length >= MAX_LEAVES}
          onUpdate={handleUpdateNode} // Ensure Controls component accepts these props
          onRemove={handleRemoveLeaf}
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
          onNodeClick={handleNodeClick}
          shapeRefs={shapeRefs} // Pass shapeRefs if TreeArea needs it
          data={data} // Pass data to TreeArea
          parentMap={parentMap} // Pass parentMap to TreeArea if needed
        />

        <EditNodeModal
          selectedNode={selectedNode}
          delta={delta}
          setDelta={setDelta}
          onUpdate={handleUpdateNode}
          onRemove={handleRemoveLeaf}
          position={editBoxPos}
          onMouseDown={handleEditBoxMouseDown}
        />

        <NotificationSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          onClose={handleCloseSnackbar}
        />

        <TreeStructure parentMap={parentMap} />
      </Box>
    </SegmentTreeProvider>
  );
}
