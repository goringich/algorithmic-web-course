import React, { useState } from "react";
import { SegmentTree } from "./SegmentTree";
import { Stage, Layer, Circle, Text, Line } from "react-konva";

const SegmentTreeVisualizer = () => {
  const [segmentTree] = useState(new SegmentTree([5, 8, 6, 3, 2, 7, 2, 6]));
  const [nodes, setNodes] = useState(segmentTree.getTreeForVisualization());
  const [selectedNode, setSelectedNode] = useState(null); // Текущий выбранный узел
  const [delta, setDelta] = useState(0); // Значение для добавления
  const [animation, setAnimation] = useState(false); // Состояние анимации

  // Обновление узла
  const handleUpdate = () => {
    if (selectedNode !== null) {
      segmentTree.update(selectedNode.range[0], delta);
      setAnimation(true); // Включаем анимацию
      setTimeout(() => {
        setNodes(segmentTree.getTreeForVisualization());
        setAnimation(false); // Выключаем анимацию после обновления
        setSelectedNode(null);
      }, 500); // Длительность анимации
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
                fill={selectedNode?.id === node.id ? "#FFC107" : "#A259FF"} // Выделяем выбранный узел
                stroke="black"
                strokeWidth={2}
                onClick={() => setSelectedNode(node)} // Устанавливаем выбранный узел
                shadowBlur={animation && selectedNode?.id === node.id ? 15 : 0} // Анимация тени
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
