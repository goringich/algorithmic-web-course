import React from "react";
import { Stage, Layer, Rect, Text, Line } from "react-konva";

const NODE_WIDTH = 50;
const NODE_HEIGHT = 30;

const SegmentTree = ({ nodes, width, height }) => {
  return (
    <Stage width={width} height={height}>
      <Layer>
        {nodes.map((node) => (
          <React.Fragment key={node.id}>
            <Rect
              x={node.x}
              y={node.y}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              fill="lightblue"
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={node.x + 5}
              y={node.y + 5}
              text={node.label}
              fontSize={16}
              fill="black"
            />
          </React.Fragment>
        ))}
        {nodes.map((node) => (
          <React.Fragment key={node.id}>
            <Rect
              x={node.x}
              y={node.y}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              fill={node.highlighted ? "yellow" : "lightblue"}
              cornerRadius={5}
              stroke="black"
              strokeWidth={1}
            />
            <Text
              x={node.x + 5}
              y={node.y + 5}
              text={`${node.label}\n(${node.value})`}
              fontSize={16}
              fill="black"
            />
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  );
};

export default SegmentTree;
