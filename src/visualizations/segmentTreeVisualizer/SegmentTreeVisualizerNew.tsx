import React, { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Konva from "konva";
import { useSegmentTree } from "./UseSegmentTree";
import { useDrag } from "./UseDrag";
import { SegmentTreeCanvas } from "../visualisationComponents/SegmentTreeCanvas";
import { AddElementForm } from "../../components/addElementForm/AddElementForm";
import { NotificationSnackbar } from "../../components/notificationSnackbar/NotificationSnackbar";
import { EditNodeModal } from "../../components/editNodeModal/EditNodeModal";

interface VisNode {
  id: string;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children: string[];
  isHighlighted?: boolean;
}

const MAX_LEAVES = 16;

export default function SegmentTreeVisualizerNew() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shapeRefs = useRef<Record<string, Konva.Circle>>({});
  const [stageSize, setStageSize] = useState({ width: 800, height: 1200 });

  const { data, segmentTree, rebuildTree } = useSegmentTree([5, 8, 6, 3, 2, 7, 2, 6]);
  const [nodes, setNodes] = useState<VisNode[]>(segmentTree.getTreeForVisualization());
  const [parentMap, setParentMap] = useState<Record<string, string>>({});

  const [newValue, setNewValue] = useState("");
  const [selectedNode, setSelectedNode] = useState<VisNode | null>(null);
  const [delta, setDelta] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const {
    position: editBoxPos,
    handleMouseDown: handleEditBoxMouseDown,
    handleMouseMove: handleEditBoxMouseMove,
    handleMouseUp: handleEditBoxMouseUp
  } = useDrag(400, 300);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        setStageSize({ width: clientWidth, height: 1200 });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buildParentMap = (newNodes: VisNode[]) => {
    const map: Record<string, string> = {};
    for (const node of newNodes) {
      for (const childId of node.children) {
        map[childId] = node.id;
      }
    }
    return map;
  };

  const animateNodeMove = (nodeId: string, newX: number, newY: number) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) return;
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      x: newX,
      y: newY,
      easing: Konva.Easings.EaseInOut
    }).play();
  };

  const animateNodeAppear = (nodeId: string, finalX: number, finalY: number) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) return;
    shape.scale({ x: 0, y: 0 });
    shape.y(finalY - 50);
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      scaleX: 1,
      scaleY: 1,
      y: finalY,
      easing: Konva.Easings.EaseOut
    }).play();
  };

  const animateNodeDisappear = (nodeId: string, callback?: () => void) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) {
      if (callback) callback();
      return;
    }
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      scaleX: 0,
      scaleY: 0,
      easing: Konva.Easings.EaseIn,
      onFinish: () => {
        if (callback) callback();
      }
    }).play();
  };

  const refreshNodes = (updatedTree: any) => {
    const newVisNodes = updatedTree.getTreeForVisualization();
    setNodes((prev) => {
      const removed = prev.filter((oldNode) => !newVisNodes.some((n: VisNode) => n.id === oldNode.id));
      removed.forEach((rn) => animateNodeDisappear(rn.id));
      return prev;
    });

    setNodes((prevNodes) => {
      newVisNodes.forEach((newN: VisNode) => {
        const oldNode = prevNodes.find((p) => p.id === newN.id);
        if (oldNode) {
          if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
            animateNodeMove(newN.id, newN.x, newN.y);
          }
        } else {
          setTimeout(() => {
            animateNodeAppear(newN.id, newN.x, newN.y);
          }, 50);
        }
      });
      return newVisNodes;
    });

    const map = buildParentMap(newVisNodes);
    setParentMap(map);
  };

  const updateTreeWithNewData = (newData: number[]) => {
    rebuildTree(newData);
    refreshNodes(segmentTree);
  };

  const handleAddElement = () => {
    if (newValue === "") return;
    const value = parseInt(newValue, 10);
    if (isNaN(value)) return;
    if (data.length >= MAX_LEAVES) {
      alert("Превышен лимит (16) листьев.");
      setNewValue("");
      return;
    }
    const updatedData = [...data, value];
    updateTreeWithNewData(updatedData);
    setNewValue("");
  };

  const highlightPathFromLeaf = (leafNodeId: string) => {
    let currentId: string | undefined = leafNodeId;
    let prevId: string | null = null;
    setNodes((old) => old.map((n) => ({ ...n, isHighlighted: false })));
    const pathIds: string[] = [];
    while (currentId) {
      pathIds.push(currentId);
      const pId = parentMap[currentId];
      if (!pId || pId === currentId) break;
      currentId = pId;
    }
    let i = 0;
    const interval = setInterval(() => {
      if (prevId) {
        setNodes((old) => old.map((node) =>
          node.id === prevId ? { ...node, isHighlighted: false } : node
        ));
      }
      if (i < pathIds.length) {
        const currentHighlightId = pathIds[i];
        setNodes((old) => old.map((node) =>
          node.id === currentHighlightId ? { ...node, isHighlighted: true } : node
        ));
        prevId = currentHighlightId;
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (prevId) {
            setNodes((old) => old.map((node) =>
              node.id === prevId ? { ...node, isHighlighted: false } : node
            ));
          }
        }, 800);
      }
    }, 800);
  };

  const handleUpdate = () => {
    if (!selectedNode) return;
    const [start, end] = selectedNode.range;
    if (start !== end) return;
    segmentTree.update(start, delta);
    refreshNodes(segmentTree);
    const leafNode = nodes.find((n) => n.range[0] === start && n.range[1] === end);
    if (leafNode) {
      highlightPathFromLeaf(leafNode.id);
    }
    setSnackbarMessage(`Значение узла [${start},${end}] обновлено до ${delta}`);
    setSnackbarOpen(true);
    setSelectedNode(null);
  };

  const handleRemoveLeaf = () => {
    if (selectedNode && selectedNode.range[0] === selectedNode.range[1]) {
      const pos = selectedNode.range[0];
      animateNodeDisappear(selectedNode.id, () => {
        const newArr = [...data];
        newArr.splice(pos, 1);
        updateTreeWithNewData(newArr);
      });
      setSelectedNode(null);
    }
  };

  const handleNodeClick = (node: VisNode) => {
    if (node.range[0] === node.range[1]) {
      setSelectedNode(node);
      setDelta(node.value);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

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
      onMouseMove={(e) => handleEditBoxMouseMove(e, stageSize.width, stageSize.height, 300, 150)}
      onMouseUp={handleEditBoxMouseUp}
    >
      <Typography variant="h4" marginBottom={2} sx={{ fontWeight: "bold" }}>
        Segment Tree Visualizer
      </Typography>

      <AddElementForm
        newValue={newValue}
        onChangeValue={setNewValue}
        onAdd={handleAddElement}
        disabled={data.length >= MAX_LEAVES}
      />

      <SegmentTreeCanvas
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
    </Box>
  );
}
