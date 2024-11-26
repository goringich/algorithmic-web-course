import React from "react";
import { Stage, Layer, Circle, Text, Line } from "react-konva";

const NODE_RADIUS = 30;

const SegmentTree = ({ nodes, width, height }) => {
  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Линии между узлами */}
        {nodes.map((node) =>
          node.children.map((childId) => {
            const child = nodes.find((n) => n.id === childId);
            return (
              <Line
                key={`${node.id}-${childId}`}
                points={[node.x, node.y + NODE_RADIUS, child.x, child.y - NODE_RADIUS]}
                stroke="#A259FF"
                strokeWidth={2}
                lineCap="round"
              />
            );
          })
        )}

        {/* Узлы дерева */}
        {nodes.map((node) => (
          <React.Fragment key={node.id}>
            <Circle
              x={node.x}
              y={node.y}
              radius={NODE_RADIUS}
              fill="#A259FF"
              stroke="black"
              strokeWidth={2}
              shadowBlur={10}
              shadowColor="rgba(0, 0, 0, 0.2)"
            />
            <Text
              x={node.x - NODE_RADIUS / 2}
              y={node.y - NODE_RADIUS / 2}
              text={`${node.label}\n(${node.value})`}
              fontSize={12}
              fontStyle="bold"
              fill="white"
              align="center"
            />
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  );
};

export default SegmentTree;
