import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import { animateNodeMove, animateNodeAppear, animateNodeDisappear } from '../../../visualisationComponents/nodeAnimations/nodeAnimations';
import { buildParentMap } from '../../../visualisationComponents/nodeAnimations/utils/buildParentMap';
import { validateParentMap } from '../../../visualisationComponents/highlightPathFromLeaf/utils/validateParentMap';
import { fixParentMap } from '../../../visualisationComponents/highlightPathFromLeaf/utils/fixParentMap';
import SegmentTreeWasm from '../SegmentTreeWasm';
import Konva from 'konva';

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
  if (!segmentTree) {
    console.error("SegmentTreeWasm instance is not initialized.");
    return null;
  }

  try {
    // Update data and rebuild the tree
    await segmentTree.setData(newData);
    const newVisNodes = await segmentTree.getTreeForVisualization();

    const rootId = newVisNodes[0]?.id;
    if (rootId === undefined) {
      throw new Error("No root node found in the new visualization nodes.");
    }

    let newParentMap = buildParentMap(newVisNodes, rootId);

    // Validate and fix parentMap
    if (!validateParentMap(newParentMap, rootId)) {
      console.warn("Invalid parentMap detected. Attempting to fix...");
      newParentMap = fixParentMap(newParentMap, rootId);

      if (!validateParentMap(newParentMap, rootId)) {
        throw new Error("Unable to fix parentMap: Cycles or orphan nodes remain.");
      }
    }

    // Check for orphan nodes
    const orphanNodes = newVisNodes.filter(node => node.id !== rootId && !newParentMap[node.id]);
    if (orphanNodes.length > 0) {
      console.warn("Orphan nodes detected, fixing structure.", orphanNodes);

      orphanNodes.forEach(node => {
        newParentMap[node.id] = rootId;
      });
    }

    // Animate disappearance of removed nodes
    const removedNodes = nodes.filter(oldNode => !newVisNodes.some(n => n.id === oldNode.id));
    removedNodes.forEach(rn => {
      animateNodeDisappear(rn.id, shapeRefs.current, () => {
        delete shapeRefs.current[rn.id];
      });
    });

    // Animate movement and appearance of nodes
    for (const newN of newVisNodes) {
      const shapeRef = shapeRefs.current[newN.id.toString()];
      if (!shapeRef) {
        shapeRefs.current[newN.id.toString()] = createShapeRef(newN, layerRef);
      }

      const oldNode = nodes.find(p => p.id === newN.id);
      if (oldNode) {
        if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
          animateNodeMove(newN.id, newN.x, newN.y, shapeRefs.current, newParentMap);
        }
      } else {
        setTimeout(() => {
          animateNodeAppear(newN.id, newN.x, newN.y, shapeRefs.current);
        }, 500);
      }
    }

    // Update parentMap and nodes
    setParentMap(newParentMap);
    setNodes(newVisNodes);

    return newVisNodes;
  } catch (error) {
    console.error("Error while updating the tree:", error);
    return null;
  }
};


// Helper function to create a new shape reference
const createShapeRef = (node: VisNode, layerRef: React.MutableRefObject<Konva.Layer | null>): Konva.Circle => {
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
  }

  return newShape;
};