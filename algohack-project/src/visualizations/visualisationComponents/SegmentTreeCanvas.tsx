// src/components/SegmentTreeCanvas.js
import React from "react";
import { Stage, Layer, Line } from "react-konva";
import SegmentTreeNode from "../../assets/JS_complied_algorithms/SegmentTreeWithPath.js/index.js";
import PropTypes from "prop-types";

const SegmentTreeCanvas = ({
  nodes,
  shapeRefs,
  handleNodeClick,
  circleColor,
  highlightColor,
  selectedColor,
  getTextColor,
  leafStrokeWidth,
  internalNodeStrokeWidth,
  lineColor,
}) => (
  <Stage width={800} height={1200}>
    <Layer>
      {/* Draw Lines Between Parent and Child Nodes */}
      {nodes.map((parentNode) =>
        parentNode.children.map((childId) => {
          const childNode = nodes.find((n) => n.id === childId);
          if (!childNode) return null;
          return (
            <Line
              key={`${parentNode.id}-${childId}`}
              points={[parentNode.x, parentNode.y, childNode.x, childNode.y]}
              stroke={lineColor}
              strokeWidth={2}
              lineCap="round"
            />
          );
        })
      )}

      {/* Render All Nodes */}
      {nodes.map((node) => (
        <SegmentTreeNode
          key={node.id}
          node={node}
          isHighlighted={node.isHighlighted}
          isSelected={false} // Selection is managed in the parent component
          onClick={() => handleNodeClick(node)}
          shapeRef={(el) => (shapeRefs.current[node.id] = el)}
          getTextColor={getTextColor}
          circleColor={circleColor}
          highlightColor={highlightColor}
          selectedColor={selectedColor}
          leafStrokeWidth={leafStrokeWidth}
          internalNodeStrokeWidth={internalNodeStrokeWidth}
        />
      ))}
    </Layer>
  </Stage>
);

SegmentTreeCanvas.propTypes = {
  nodes: PropTypes.array.isRequired,
  shapeRefs: PropTypes.object.isRequired,
  handleNodeClick: PropTypes.func.isRequired,
  circleColor: PropTypes.string.isRequired,
  highlightColor: PropTypes.string.isRequired,
  selectedColor: PropTypes.string.isRequired,
  getTextColor: PropTypes.func.isRequired,
  leafStrokeWidth: PropTypes.number.isRequired,
  internalNodeStrokeWidth: PropTypes.number.isRequired,
  lineColor: PropTypes.string.isRequired,
};

export default SegmentTreeCanvas;
