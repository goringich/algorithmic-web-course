import React, { useEffect, useRef } from "react";
import { Circle, Text } from "react-konva";
import Konva from "konva";
import { VisNode } from "@src/visualizations/types/VisNode";
import { useNodeAppearAnimation } from "../animations/nodeAnimations/animateNodeAppear";
import useAnimatedValue from "../animations/highlightPathFromLeaf/hooks/useAnimateValue";

interface SegmentTreeNodeProps {
  node: VisNode;
  allNodes: VisNode[];
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
  onNodeClick: (node: VisNode) => void;
  strokeWidth: number;
  textColor: string;
  fillOverride?: string;
  isHighlighted: boolean;
  highlightIndex?: number;
}

const buildNodeMap = (nodes: VisNode[]): Record<number, VisNode> => {
  const map: Record<number, VisNode> = {};
  nodes.forEach((n) => {
    map[n.id] = n;
  });
  return map;
};

function computeDepth(node: VisNode, nodeMap: Record<number, VisNode>): number {
  let depth = 0;
  let current: VisNode | undefined = node;
  while (current && current.parentId !== current.id) {
    depth++;
    current = nodeMap[current.parentId];
    if (!current) break;
  }
  return depth;
}

export const SegmentTreeNode: React.FC<SegmentTreeNodeProps> = ({
  node,
  allNodes,
  shapeRefs,
  onNodeClick,
  strokeWidth,
  isHighlighted,
  textColor,
  fillOverride,
  highlightIndex,
}) => {
  const nodeMap = buildNodeMap(allNodes);
  const depthComputed = computeDepth(node, nodeMap);

  const minColor = [200, 230, 255];
  const maxColor = [50, 80, 150];
  const maxDepth = 6;
  const depthFactor = Math.pow(Math.min(depthComputed / maxDepth, 1), 0.7);

  const interpolateColor = (min: number, max: number, factor: number) =>
    Math.round(min + (max - min) * factor);

  const baseFillColor = fillOverride
    ? fillOverride
    : `rgb(${interpolateColor(minColor[0], maxColor[0], depthFactor)}, ${interpolateColor(
        minColor[1],
        maxColor[1],
        depthFactor
      )}, ${interpolateColor(minColor[2], maxColor[2], depthFactor)})`;

  const computedFillColor = isHighlighted ? "#e53935" : baseFillColor;

  const circleRef = useNodeAppearAnimation(node.id, node.x, node.y, shapeRefs);

  const prevPosition = useRef({ x: node.x, y: node.y });
  useEffect(() => {
    if (circleRef.current) {
      if (prevPosition.current.x !== node.x || prevPosition.current.y !== node.y) {
        circleRef.current.to({
          x: node.x,
          y: node.y,
          duration: 0.5,
          easing: Konva.Easings.EaseInOut,
        });
        prevPosition.current = { x: node.x, y: node.y };
      }
    }
  }, [node.x, node.y, circleRef]);

  const textRef = useRef<Konva.Text>(null);
  useEffect(() => {
    if (textRef.current) {
      textRef.current.to({
        x: node.x - 25,
        y: node.y - 15,
        duration: 0.5,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [node.x, node.y]);

  const delay = (highlightIndex !== undefined && highlightIndex >= 0) ? highlightIndex * 400 : 0;
  const animatedValue = useAnimatedValue(node.value, 500, delay);

  return (
    <>
      <Circle
        ref={(el) => {
          circleRef.current = el;
          if (el) shapeRefs.current[node.id] = el;
        }}
        x={node.x}
        y={node.y}
        radius={30}
        fill={computedFillColor}
        fillRadialGradientStartPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndPoint={{ x: 30, y: 30 }}
        fillRadialGradientColorStops={[0, computedFillColor, 1, "#fff"]}
        stroke="#fff"
        strokeWidth={3}
        onClick={() => {
          if (circleRef.current) {
            circleRef.current.to({
              scaleX: 0.9,
              scaleY: 0.9,
              duration: 0.1,
              onFinish: () => {
                circleRef.current?.to({
                  scaleX: 1,
                  scaleY: 1,
                  duration: 0.1,
                });
              },
            });
          }
          onNodeClick(node);
        }}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "pointer";
          e.target.to({
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 0.2,
          });
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "default";
          e.target.to({
            scaleX: 1,
            scaleY: 1,
            duration: 0.2,
          });
        }}
        shadowColor="rgba(0, 0, 0, 0.4)"
        shadowBlur={10}
        shadowOffset={{ x: 4, y: 4 }}
        shadowOpacity={0.6}
      />
      <Text
        ref={textRef}
        x={node.x - 25}
        y={node.y - 15}
        text={`${node.label}\n(${Math.round(animatedValue)})`}
        fontSize={14}
        fontFamily="Roboto"
        fontStyle="bold"
        fill={textColor}
        align="center"
        width={50}
        listening={false}
        shadowColor="rgba(0, 0, 0, 0.2)"
        shadowBlur={2}
        shadowOffset={{ x: 1, y: 1 }}
      />
    </>
  );
};
