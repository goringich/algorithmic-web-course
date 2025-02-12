import { VisNode } from '../../../types/VisNode';
import SegmentTreeWasm from '../SegmentTreeWasm';
import Konva from 'konva';
import React from 'react';
import { waitForLayerRef } from './functions/waitForLayerRef';
import { normalizeVisNodes } from './functions/normalizeVisNodes';
import { buildAndValidateParentMap } from './functions/buildAndValidateParentMap';

export const updateTreeWithNewData = async (
  newData: number[],
  // Старый экземпляр не используется – мы будем создавать новый
  segmentTree: SegmentTreeWasm | null,
  nodes: VisNode[],
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>,
  parentMap: Record<number, number | undefined>,
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number | undefined>>>,
  // Словарь ref с ключами типа number
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>,
  layerRef: React.MutableRefObject<Konva.Layer | null>
): Promise<VisNode[] | null> => {
  console.log("[INFO] Starting updateTreeWithNewData with newData:", newData);
  
  const currentLayer = await waitForLayerRef(layerRef);
  if (!currentLayer) {
    console.error("[ERROR] layerRef.current is null. Aborting updateTreeWithNewData.");
    return null;
  }
  
  try {
    // Очищаем старые ссылки
    shapeRefs.current = {};

    // Создаем новый экземпляр сегментного дерева с обновлёнными данными.
    // Здесь мы передаём newData напрямую, без дополнения до степени двойки.
    const newSegmentTree = new SegmentTreeWasm(newData);
    await newSegmentTree.setData(newData);
    console.log("[INFO] newSegmentTree.setData completed.");
    
    let newVisNodes = await newSegmentTree.getTreeForVisualization();
    console.log("[INFO] newSegmentTree.getTreeForVisualization returned:", newVisNodes);
    
    // Нормализуем узлы – функция должна вернуть корректную структуру дерева без пустых (dummy) узлов.
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
