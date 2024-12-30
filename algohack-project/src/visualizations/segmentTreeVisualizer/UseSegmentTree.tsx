// src/components/SegmentTreeVisualizer/useSegmentTree.js
import { useState, useRef } from "react";
import Konva from "konva";
import { SegmentTree } from "../../assets/JS_complied_algorithms/segment_tree.js";

const MAX_LEAVES = 16;

const UseSegmentTree = (initialData) => {
  const shapeRefs = useRef({});
  const [data, setData] = useState(initialData);
  const [segmentTree, setSegmentTree] = useState(new SegmentTree(initialData));
  const [nodes, setNodes] = useState(segmentTree.getTreeForVisualization());
  const [parentMap, setParentMap] = useState({});

  // Animation Functions
  const animateNodeMove = (nodeId, newX, newY) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) return;
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      x: newX,
      y: newY,
      easing: Konva.Easings.EaseInOut,
    }).play();
  };

  const animateNodeAppear = (nodeId, finalX, finalY) => {
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
      easing: Konva.Easings.EaseOut,
    }).play();
  };

  const animateNodeDisappear = (nodeId, callback) => {
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
      },
    }).play();
  };

  // Build Parent Map
  const buildParentMap = (newNodes) => {
    const map = {};
    for (const node of newNodes) {
      for (const childId of node.children) {
        map[childId] = node.id;
      }
    }
    return map;
  };

  // Refresh Nodes after tree update
  const refreshNodes = (updatedTree) => {
    const newVisNodes = updatedTree.getTreeForVisualization();

    // Animate disappearance of removed nodes
    setNodes((prev) => {
      const removed = prev.filter(
        (oldNode) => !newVisNodes.some((n) => n.id === oldNode.id)
      );
      removed.forEach((rn) => {
        animateNodeDisappear(rn.id);
      });
      return prev;
    });

    // Update nodes and animate movements or appearances
    setNodes((prevNodes) => {
      newVisNodes.forEach((newN) => {
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

    // Update parentMap
    const map = buildParentMap(newVisNodes);
    setParentMap(map);
  };

  // Update Tree with New Data
  const updateTreeWithNewData = (newData) => {
    const newST = new SegmentTree(newData);
    setSegmentTree(newST);
    refreshNodes(newST);
  };

  // Add Element
  const handleAddElement = (newValue) => {
    if (newValue === "") return;
    const value = parseInt(newValue, 10);
    if (isNaN(value)) return;

    if (data.length >= MAX_LEAVES) {
      alert("Превышен лимит (16) листьев.");
      return null; // Indicate failure
    }
    const updatedData = [...data, value];
    setData(updatedData);
    updateTreeWithNewData(updatedData);
    return updatedData;
  };

  // Highlight Path from Leaf to Root
  const highlightPathFromLeaf = (leafNodeId, setNodes) => {
    let currentId = leafNodeId;
    let prevId = null;

    // Remove previous highlights
    setNodes((old) => old.map((n) => ({ ...n, isHighlighted: false })));

    const pathIds = [];
    while (currentId) {
      pathIds.push(currentId);
      const pId = parentMap[currentId];
      if (!pId || pId === currentId) break;
      currentId = pId;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (prevId != null) {
        setNodes((old) =>
          old.map((node) =>
            node.id === prevId ? { ...node, isHighlighted: false } : node
          )
        );
      }
      if (i < pathIds.length) {
        const currentHighlightId = pathIds[i];
        setNodes((old) =>
          old.map((node) =>
            node.id === currentHighlightId
              ? { ...node, isHighlighted: true }
              : node
          )
        );
        prevId = currentHighlightId;
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (prevId !== null) {
            setNodes((old) =>
              old.map((node) =>
                node.id === prevId ? { ...node, isHighlighted: false } : node
              )
            );
          }
        }, 800);
      }
    }, 800);
  };

  return {
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
    animateNodeMove,
    animateNodeAppear,
    animateNodeDisappear,
  };
};

export default UseSegmentTree;
