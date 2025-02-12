import { VisNode } from '../../../types/VisNode';
import SegmentTreeWasm from '../SegmentTreeWasm';
import Konva from 'konva';
import React from 'react';
import { waitForLayerRef } from './functions/waitForLayerRef';
import { normalizeVisNodes } from './functions/normalizeVisNodes';
import { buildAndValidateParentMap } from './functions/buildAndValidateParentMap';

function padArrayToPowerOf2(arr: number[]): number[] {
  const nextPow2 = Math.pow(2, Math.ceil(Math.log2(arr.length)));
  const padded = arr.slice();
  while (padded.length < nextPow2) {
    padded.push(0); // Используем 0 как заполнитель
  }
  return padded;
}

export const updateTreeWithNewData = async (
  newData: number[],
  segmentTree: SegmentTreeWasm | null,
  nodes: VisNode[],
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>,
  parentMap: Record<number, number | undefined>,
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number | undefined>>>,
  // Используем словарь ref с ключами типа number
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>,
  layerRef: React.MutableRefObject<Konva.Layer | null>
): Promise<VisNode[] | null> => {
  console.log("[INFO] Starting updateTreeWithNewData with newData:", newData);
  
  const currentLayer = await waitForLayerRef(layerRef);
  if (!currentLayer) {
    console.error("[ERROR] layerRef.current is null. Aborting updateTreeWithNewData.");
    return null;
  }
  if (!segmentTree) {
    console.error("[ERROR] SegmentTreeWasm instance is not initialized.");
    return null;
  }
  
  try {
    // Очищаем старые ссылки
    shapeRefs.current = {};
    // Дополняем массив до ближайшей степени двойки
    const paddedData = padArrayToPowerOf2(newData);
    await segmentTree.setData(paddedData);
    console.log("[INFO] segmentTree.setData completed.");
    
    let newVisNodes = await segmentTree.getTreeForVisualization();
    console.log("[INFO] segmentTree.getTreeForVisualization returned:", newVisNodes);
    
    newVisNodes = normalizeVisNodes(newVisNodes);
    const rootId = newVisNodes[0]?.id;
    if (rootId === undefined) {
      throw new Error("No root node found in the new visualization nodes.");
    }
    console.log(`[INFO] Root node id is ${rootId}`);
    
    const newParentMap = buildAndValidateParentMap(newVisNodes, rootId);
    setParentMap(newParentMap);
    setNodes(newVisNodes);
    
    console.log("[INFO] Tree update completed successfully.");
    return newVisNodes;
  } catch (error) {
    console.error("[ERROR] Error while updating the tree:", error);
    return null;
  }
};
