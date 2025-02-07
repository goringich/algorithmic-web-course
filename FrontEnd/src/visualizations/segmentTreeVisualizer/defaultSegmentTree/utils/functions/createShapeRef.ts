import Konva from 'konva';
import React from 'react';
import { VisNode } from '../../../../types/VisNode';

export function createShapeRef(
  node: VisNode,
  layerRef: React.MutableRefObject<Konva.Layer | null>
): Konva.Circle {
  console.log(`[INFO] Creating shape for node ${node.id} at (${node.x}, ${node.y}).`);
  const newShape = new Konva.Circle({
    x: node.x,
    y: node.y,
    radius: 20,
    fill: 'black',
    id: node.id.toString(),
  });
  if (layerRef.current) {
    layerRef.current.add(newShape);
    layerRef.current.draw();
    console.log(`[DEBUG] Shape for node ${node.id} added to layer and drawn.`);
  } else {
    console.warn(`[WARN] layerRef is null. Cannot add shape for node ${node.id}.`);
  }
  return newShape;
}
