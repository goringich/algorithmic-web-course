import { useCallback } from 'react';
import SegmentTreeWasm from '../../../SegmentTreeWasm';
import { VisNode } from '../../../visualisationComponents/nodeAnimations/types/VisNode';
import { animateNodeMove, animateNodeAppear, animateNodeDisappear } from '../../../visualisationComponents/nodeAnimations/nodeAnimations';
import { buildParentMap } from '../../../visualisationComponents/nodeAnimations/utils/buildParentMap';
import Konva from 'konva';

interface UseUpdateSegmentTreeProps {
  nodes: VisNode[];
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  parentMap: Record<number, number>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  segmentTree: SegmentTreeWasm | null;
  shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>; // Changed to string
  layerRef: React.MutableRefObject<Konva.Layer | null>; // Added layerRef
}

interface UseUpdateSegmentTreeReturn {
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
}

const useUpdateSegmentTree = ({
  nodes,
  setNodes,
  parentMap,
  setParentMap,
  segmentTree,
  shapeRefs,
  layerRef
}: UseUpdateSegmentTreeProps): UseUpdateSegmentTreeReturn => {
  const updateTreeWithNewData = useCallback(
    async (newData: number[]): Promise<VisNode[] | null> => {
      if (!segmentTree) {
        console.error("SegmentTreeWasm instance is not initialized.");
        return null;
      }

      try {
        // Update data and rebuild the tree
        await segmentTree.setData(newData);
        const newVisNodes = await segmentTree.getTreeForVisualization();
        console.log("Updated nodes:", newVisNodes);

        let newParentMap = buildParentMap(newVisNodes);

        // Check for orphan nodes
        const orphanNodes = newVisNodes.filter(node => !newParentMap[node.id]);
        if (orphanNodes.length > 0) {
          console.warn("Orphan nodes detected, fixing structure.", orphanNodes);

          orphanNodes.forEach(node => {
            const nodeId = node.id;
            const trueRootId = newVisNodes[0].id; // Use the first node as root
            newParentMap[nodeId] = trueRootId;
            console.log(`Reassigning orphan node '${nodeId}' to true root '${trueRootId}'`);
          });
        }

        console.log("Updated parentMap:", newParentMap);

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
            console.warn(`ShapeRef for nodeId ${newN.id} not found. Creating new shapeRef.`);
            shapeRefs.current[newN.id.toString()] = createShapeRef(newN);
          }

          const updatedShapeRef = shapeRefs.current[newN.id.toString()];
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
        console.log("Final parentMap after refresh:", newParentMap);

        return newVisNodes;
      } catch (error) {
        console.error("Error while updating the tree:", error);
        return null;
      }
    },
    [nodes, segmentTree, shapeRefs, setNodes, setParentMap, layerRef]
  );

  // Function to create a new shape reference
  const createShapeRef = (node: VisNode): Konva.Circle => {
    const newShape = new Konva.Circle({
      x: node.x,
      y: node.y,
      radius: 20,
      fill: 'blue',
      id: node.id.toString(),
    });

    // Add the new shape to the Konva layer
    if (layerRef.current) {
      layerRef.current.add(newShape);
      layerRef.current.draw(); // Redraw the layer to reflect changes
    }

    return newShape;
  };

  return { updateTreeWithNewData };
};

export default useUpdateSegmentTree;
