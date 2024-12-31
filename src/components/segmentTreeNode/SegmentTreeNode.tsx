// src/components/SegmentTreeNode.js
import React from "react";
import { Circle, Text } from "react-konva";

const SegmentTreeNode = ({
  node,
  isHighlighted,
  isSelected,
  onClick,
  shapeRef,
  getTextColor,
  circleColor,
  highlightColor,
  selectedColor,
  leafStrokeWidth,
  internalNodeStrokeWidth,
}) => {
  const isLeaf = node.range[0] === node.range[1];
  // Determine fill color based on state
  let fillColor = circleColor;
  if (isHighlighted) fillColor = highlightColor;
  else if (isSelected) fillColor = selectedColor;

  // Determine stroke width
  const strokeW = isLeaf ? leafStrokeWidth : internalNodeStrokeWidth;

  return (
    <React.Fragment>
      <Circle
        ref={shapeRef}
        x={node.x}
        y={node.y}
        radius={30}
        fill={fillColor}
        stroke="black"
        strokeWidth={strokeW}
        listening={true}
        onClick={onClick}
        // Change cursor on hover
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "pointer";
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "default";
        }}
        // Shadows for aesthetics
        shadowColor="#000"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 2 }}
        shadowOpacity={0.2}
      />
      <Text
        x={node.x - 25}
        y={node.y - 15}
        text={`${node.label}\n(${node.value})`}
        fontSize={12}
        fill={getTextColor(fillColor)}
        align="center"
        width={50}
      />
    </React.Fragment>
  );
};

export default SegmentTreeNode;
