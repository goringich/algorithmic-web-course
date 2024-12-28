import React, { useState, useRef, useEffect } from "react";
import { SegmentTree } from "../assets/JS_complied_algorithms/SegmentTree";
import { Stage, Layer, Circle, Text, Line } from "react-konva";
import Konva from "konva";
import { TextField, Button, Box, Typography } from "@mui/material";

const MAX_LEAVES = 16;

const SegmentTreeVisualizer = () => {
  const containerRef = useRef(null);
  const [data, setData] = useState([5, 8, 6, 3, 2, 7, 2, 6]);
  const [segmentTree, setSegmentTree] = useState(new SegmentTree(data));
  const [nodes, setNodes] = useState(segmentTree.getTreeForVisualization());
  const [selectedNode, setSelectedNode] = useState(null);
  const [delta, setDelta] = useState(0);
  const [newValue, setNewValue] = useState("");
  const [stageSize, setStageSize] = useState({ width: 800, height: 600});
  const shapeRefs = useRef({});

  // Hook for processing of window size changing and scene adaptation
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setStageSize({ width: clientWidth, height: clientHeight });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  // Node moves on new coordinates
  const animateNodeMove = (nodeId, newX, newY) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) return;

    new Konva.Tween({
      node: shape,
      duration: 1.2, 
      x: newX,
      y: newY,
      easing: Konva.Easings.EaseInOut
    }).play();
  }

  // refresh node with animation
  const refreshNodes = (updateTree) => {
    const newVisNodes = updateTree.getTreeForVisualization();
    setNodes((prevNodes) => {
      // for each node find the previous node and start the motion animation
      newVisNodes.forEach( (n) => {
        const oldNode = prevNodes.find((p) => p.id === n.id);
        if (oldNode) {
          animateNodeMove(n.id, n.x, n.y);
        }
      })
      return newVisNodes;
    })
  }

  // Updating the segment tree with new data and updating the visualisation
  const updateTreeWithNewData = (newData) => {
    const updatedTree = new SegmentTree(newData);
    setSegmentTree(updatedTree);
    refreshNodes(updatedTree);
  }

  // Handler for adding a new item to leaves
  const handleAddElement = () => {
    if (newValue === "Достигнут предел в 16 листьев.") return;
    const valueToAdd = parseInt(newValue);
    if (isNaN(valueToAdd)) return;

    const leafCount = data.length;
    if (leafCount >= MAX_LEAVES) {
      alert("The limit of 16 leaves has been reached.");
      setNewValue("");
      return
    }

    // Update data with new elements and tree
    setData((prevData) => {
      const updateData = [...prevData, valueToAdd];
      updateTreeWithNewData(updateData);
      return updateData;
    });
    setNewValue(""); // Clearing the input field
  }

  // Handler for updating the value of the selected node
  const handleUpdate = () => {
    if (selectedNode !== null && selectedNode.range[0] === selectedNode.range[1]) {
      segmentTree.update(selectedNode.range[0], delta);
      refreshNodes(segmentTree);
      setSelectedNode(null);
      setDelta(0);
    }
  };

  // Select a node only if it is a leaf
  const handleNodeClick = (node) => {
    if (node.range[0] === node.range[1]){
      setSelectedNode(node);
    }
  }

  const handleRemoveLeaf = () => {
    if (selectedNode && selectedNode.range[0] === selectedNode.range[1]){
      const indexToRemove = selectedNode.range[0];
      setData((prev) => {
        const updated = [...prev];
        updated.splice(indexToRemove, 1);
        updateTreeWithNewData(updated);
        return updated;
      })
      setSelectedNode(null);
    }
  }

  return (
    <Box
      ref={containerRef} // Link to dimensioning container
      width="100%"
      height="100%"
      minHeight="600px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="start"
      padding="20px"
      boxSizing="border-box"
    >
      {/* Title for visualiser */}
      <Typography variant="h4" marginBottom={2}>
        Segment Tree Visualizer
      </Typography>

      {/* Fields for adding and removing items */}
      <Box display="flex" justifyContent="center" gap={2} marginBottom={2}>
        <TextField
          label="Добавить элемент"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          type="number"
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleAddElement}>
          Добавить
        </Button>
      </Box>


      <div style={{ textAlign: "center", margin: "20px" }}>
        <h2>Segment Tree Visualizer</h2>
        <Stage width={stageSize.width} height={stageSize.height}>
          <Layer>
            {/* Линии между узлами */}
            {nodes.map((parentNode) =>
              parentNode.children.map((childId) => {
                const child = nodes.find((n) => n.id === childId);
                return (
                  <Line
                    key={`${parentNode.id}-${childId}`}
                    points={[parentNode.x, parentNode.y, child.x, child.y]}
                    stroke="#A259FF"
                    strokeWidth={2}
                    lineCap="round"
                  />
                );
              })
            )}
            {/* Узлы */}
            {nodes.map((node) => (
              <React.Fragment key={node.id}>
                <Circle
                  ref={(el) => (shapeRefs.current[node.id] = el)} // ref on node for animation
                  x={node.x}
                  y={node.y}
                  radius={30}
                  fill={selectedNode?.id === node.id ? "#FFC107" : "#A259FF"}
                  stroke="black"
                  strokeWidth={2}
                  onClick={() => setSelectedNode(node)}
                />
                <Text
                  x={node.x - 15}
                  y={node.y - 15}
                  text={`${node.label}\n(${node.value})`}
                  fontSize={12}
                  fill="white"
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
        {/* Управление значением узла */}
        { selectedNode && (
          <Box
            position = "absolute"
            top = "65%"
            left = "50%"
            transform = "translate(-50%, -50%)"
            backgroundColor= "white"
            padding= "20px"
            border= "1px solid #ddd"
            borderRadius= "10px"
            boxShadow= "0 4px 8px rgba(0, 0, 0, 0.2)"
            zIndex={100}
            width="300px"
            display="flex"
            flexDirection="column"
            gap="10px"
          >
            <Typography variant="h6">Update Node: {selectedNode.label}</Typography>
            <TextField
              type="number"
              value={delta}
              onChange={(e) => setDelta(parseInt(e.target.value) || 0)}
              fullWidth
            />
            <button
              onClick={handleUpdate}
              variant="contained"
              color="primary"
              fullWidth
            >
              Update
            </button>

            <button
              onClick={handleRemoveLeaf}
              variant="contained"
              color="error"
              fullWidth
            >
              Remove
            </button>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default SegmentTreeVisualizer;
