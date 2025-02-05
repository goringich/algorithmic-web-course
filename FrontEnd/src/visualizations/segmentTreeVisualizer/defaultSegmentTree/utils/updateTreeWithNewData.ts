import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import {
  animateNodeMove,
  animateNodeAppear,
  animateNodeDisappear
} from '../../../visualisationComponents/nodeAnimations/nodeAnimations';
import { buildParentMap } from '../../../visualisationComponents/nodeAnimations/utils/buildParentMap';
import { validateParentMap } from '../../../visualisationComponents/highlightPathFromLeaf/utils/validateParentMap';
import { fixParentMap } from '../../../visualisationComponents/highlightPathFromLeaf/utils/fixParentMap';
import SegmentTreeWasm from '../SegmentTreeWasm';
import Konva from 'konva';
import React from 'react';

export const updateTreeWithNewData = async (
  newData: number[],
  segmentTree: SegmentTreeWasm | null,
  nodes: VisNode[],
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>,
  parentMap: Record<number, number | undefined>,
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number | undefined>>>,
  shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>,
  layerRef: React.MutableRefObject<Konva.Layer | null>
): Promise<VisNode[] | null> => {
  console.log(
    `[INFO] Starting updateTreeWithNewData with newData:`,
    newData
  );
  
  // Если layerRef отсутствует, нельзя обновлять фигуры
  if (!layerRef.current) {
    console.error(
      "[ERROR] layerRef.current is null. Aborting updateTreeWithNewData."
    );
    return null;
  }
  
  if (!segmentTree) {
    console.error("[ERROR] SegmentTreeWasm instance is not initialized.");
    return null;
  }
  try {
    await segmentTree.setData(newData);
    console.log("[INFO] segmentTree.setData completed.");
    
    let newVisNodes = await segmentTree.getTreeForVisualization();
    console.log(
      "[INFO] segmentTree.getTreeForVisualization returned:",
      newVisNodes
    );
    
    // Приведение типа: добавляем свойство parentId (если отсутствует)
    newVisNodes = newVisNodes.map((node, index) => ({
      ...node,
      parentId: node.parentId !== undefined ? node.parentId : (index === 0 ? undefined : 0),
      isHighlighted: false,
      children: node.children as unknown as number[]
    }));
    console.log("[DEBUG] Mapped newVisNodes:", newVisNodes);
    
    const rootId = newVisNodes[0]?.id;
    if (rootId === undefined) {
      throw new Error("No root node found in the new visualization nodes.");
    }
    console.log(`[INFO] Root node id is ${rootId}`);
    
    let newParentMap = buildParentMap(newVisNodes);
    console.log("[DEBUG] Built initial parentMap:", newParentMap);
    
    if (!validateParentMap(newVisNodes, rootId)) {
      console.warn("[WARN] Invalid parentMap detected. Attempting to fix...");
      const fixedParentMap = fixParentMap(newVisNodes, newParentMap, rootId);
      console.log("[DEBUG] Fixed parentMap:", fixedParentMap);
      if (!validateParentMap(newVisNodes, rootId)) {
        throw new Error("Unable to fix parentMap: Cycles or orphan nodes remain.");
      }
      newParentMap = fixedParentMap;
    }
    
    const orphanNodes = newVisNodes.filter(
      node => node.id !== rootId && newParentMap[node.id] === undefined
    );
    if (orphanNodes.length > 0) {
      console.warn("[WARN] Orphan nodes detected, fixing structure.", orphanNodes);
      orphanNodes.forEach(node => {
        newParentMap[node.id] = rootId;
      });
    }
    console.log("[DEBUG] Final parentMap:", newParentMap);
    
    // Обработка удалённых узлов: определяем те, которых нет в новом наборе
    const removedNodes = nodes.filter(
      oldNode => !newVisNodes.some(n => n.id === oldNode.id)
    );
    console.log(`[INFO] Removed nodes detected:`, removedNodes.map(n => n.id));
    
    removedNodes.forEach(rn => {
      console.log(`[INFO] Animating disappearance for removed node ${rn.id}`);
      // Если animateNodeDisappear возвращает промис, можно ждать его завершения
      animateNodeDisappear(rn.id, shapeRefs.current)
        .then(() =>
          console.log(`[DEBUG] Removal animation finished for node ${rn.id}`)
        )
        .catch(err =>
          console.error(`[ERROR] Removal animation failed for node ${rn.id}:`, err)
        );
      // Удаляем ссылку на фигуру (для страховки)
      delete shapeRefs.current[rn.id.toString()];
    });
    
    // Обработка существующих и новых узлов
    for (const newN of newVisNodes) {
      const key = newN.id.toString();
      const shapeRef = shapeRefs.current[key];
      const oldNode = nodes.find(p => p.id === newN.id);
      
      if (!shapeRef) {
        console.log(`[INFO] No shape found for node ${newN.id}. Creating new shape.`);
        shapeRefs.current[key] = createShapeRef(newN, layerRef);
      } else {
        if (oldNode) {
          if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
            console.log(
              `[INFO] Node ${newN.id} position changed from (${oldNode.x}, ${oldNode.y}) to (${newN.x}, ${newN.y}). Animating move.`
            );
            animateNodeMove(newN.id, newN.x, newN.y, shapeRefs.current, newParentMap);
          } else {
            console.log(`[DEBUG] Node ${newN.id} position unchanged.`);
          }
        } else {
          console.log(`[INFO] New node ${newN.id} detected. Animating appearance after delay.`);
          setTimeout(() => {
            animateNodeAppear(newN.id, newN.x, newN.y, shapeRefs.current);
          }, 500);
        }
      }
    }
    
    setParentMap(newParentMap);
    setNodes(newVisNodes);
    console.log("[INFO] Tree update completed successfully.");
    return newVisNodes;
  } catch (error) {
    console.error("[ERROR] Error while updating the tree:", error);
    return null;
  }
};

const createShapeRef = (
  node: VisNode,
  layerRef: React.MutableRefObject<Konva.Layer | null>
): Konva.Circle => {
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
};
