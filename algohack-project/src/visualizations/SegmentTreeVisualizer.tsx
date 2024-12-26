import React, { useState } from "react";
import { SegmentTree } from "../assets/JS_complied_algorithms/SegmentTree";
import { Stage, Layer, Circle, Text, Line } from "react-konva";

const SegmentTreeVisualizer = () => {
  const [segmentTree] = useState(new SegmentTree([5, 8, 6, 3, 2, 7, 2, 6]));
  const [nodes, setNodes] = useState(segmentTree.getTreeForVisualization());
  const [selectedNode, setSelectedNode] = useState(null);
  const [delta, setDelta] = useState(0);
  const [animation, setAnimation] = useState(false);

  // Обновление узла
  const handleUpdate = () => {
    if (selectedNode !== null) {
      segmentTree.update(selectedNode.range[0], delta);
      setAnimation(true);
      setTimeout(() => {
        setNodes(segmentTree.getTreeForVisualization());
        setAnimation(false); 
        setSelectedNode(null);
      }, 500); 
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h2>Segment Tree Visualizer</h2>
      <Stage width={800} height={600}>
        <Layer>
          {/* Линии между узлами */}
          {nodes.map((node) =>
            node.children.map((childId) => {
              const child = nodes.find((n) => n.id === childId);
              return (
                <Line
                  key={`${node.id}-${childId}`}
                  points={[node.x, node.y, child.x, child.y]}
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
                x={node.x}
                y={node.y}
                radius={30}
                fill={selectedNode?.id === node.id ? "#FFC107" : "#A259FF"}
                stroke="black"
                strokeWidth={2}
                onClick={() => setSelectedNode(node)} 
                shadowBlur={animation && selectedNode?.id === node.id ? 15 : 0} 
                shadowColor="#FF5722"
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
      {selectedNode && (
        <div
          style={{
            position: "absolute",
            top: "65%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 100,
          }}
        >
          <h3>Update Node: {selectedNode.label}</h3>
          <input
            type="number"
            value={delta}
            onChange={(e) => setDelta(parseInt(e.target.value) || 0)}
            style={{
              marginBottom: "10px",
              padding: "5px",
              width: "100%",
            }}
          />
          <button
            onClick={handleUpdate}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default SegmentTreeVisualizer;
