// src/components/SegmentTreeVisualizer/useSegmentTree.js
import { useState, useRef, useEffect } from "react";
import Konva from "konva";

// Path to your WebAssembly and its JS wrapper
import createSegmentTreeModule from '../../assets/JS_complied_algorithms/segment_tree.js';

const MAX_LEAVES = 16;

const UseSegmentTree = (initialData) => {
  const shapeRefs = useRef({});
  const [data, setData] = useState(initialData);
  const [segmentTree, setSegmentTree] = useState(null); // Will hold the Wasm SegmentTree instance
  const [nodes, setNodes] = useState([]);
  const [parentMap, setParentMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const wasmModuleRef = useRef(null);

  // Load WebAssembly module and initialize SegmentTree
  useEffect(() => {
    let isMounted = true;

    const loadWasm = async () => {
      try {
        const wasmModule = await initSegmentTreeModule(); // Initialize the Wasm module
        wasmModuleRef.current = wasmModule;
        if (isMounted) {
          const st = new wasmModule.SegmentTree(initialData);
          setSegmentTree(st);
          const visNodes = st.get_tree_for_visualization(); // Assuming this returns JS-compatible data
          setNodes(visNodes);
          const map = buildParentMap(visNodes);
          setParentMap(map);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading WebAssembly module:", error);
        setIsLoading(false);
      }
    };

    loadWasm();

    return () => {
      isMounted = false;
    };
  }, [initialData]);

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
    const newVisNodes = updatedTree.get_tree_for_visualization(); // Assuming this returns JS-compatible data

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
    if (!segmentTree) return;

    try {
      segmentTree.update_data(newData); // Assuming update_data mutates the tree
      refreshNodes(segmentTree);
    } catch (error) {
      console.error("Error updating SegmentTree:", error);
    }
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
  const highlightPathFromLeaf = (leafNodeId) => {
    if (!leafNodeId || !parentMap) return;

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
    isLoading, // Indicates if Wasm module is still loading
  };
};

export default UseSegmentTree;
