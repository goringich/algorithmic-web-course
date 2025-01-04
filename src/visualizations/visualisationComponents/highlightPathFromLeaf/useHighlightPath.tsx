// src/visualisationComponents/highlightPathFromLeaf/useHighlightPath.tsx

import { useRef, useEffect } from 'react';
import { VisNode } from '../../segmentTreeVisualizer/SegmentTreeVisualizer';

interface UseHighlightPathProps {
  parentMap: Record<string, string>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
}

const useHighlightPath = ({ parentMap, setNodes }: UseHighlightPathProps) => {
  // Reference to store timeout IDs
  const timeoutsRef = useRef<number[]>([]);

  const highlightPathFromLeaf = (leafNodeId: string) => {
    console.log(`Start highlighting from leaf: ${leafNodeId}`);
  
    // Clear existing timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  
    // Reset all highlights
    setNodes((old) => old.map((n) => ({ ...n, isHighlighted: false })));
  
    // Build path from leaf to root with cycle detection
    const pathIds: string[] = [];
    let currentId: string | undefined = leafNodeId;
    const visited = new Set<string>();
  
    while (currentId && !visited.has(currentId)) {
      pathIds.push(currentId);
      visited.add(currentId);
      console.log(`Added to path: ${currentId}`);
  
      const pId = parentMap[currentId];
      console.log(`Parent of ${currentId}: ${pId}`);
  
      if (!pId || pId === currentId) { // Reached root
        console.log(`Reached end of path at: ${currentId}`);
        break;
      }
      currentId = pId;
    }

    if (currentId && visited.has(currentId)) {
      console.error(`Cycle detected at node: ${currentId}`);
      // Optionally, handle the cycle (e.g., stop processing further)
    }
  
    console.log(`Final path from leaf to root:`, pathIds);
  
    // Sequentially highlight nodes with delay
    pathIds.forEach((nodeId, index) => {
      const highlightTimeout = window.setTimeout(() => {
        console.log(`Highlighting node: ${nodeId}`);
        setNodes((old) =>
          old.map((node) =>
            node.id === nodeId ? { ...node, isHighlighted: true } : node
          )
        );
      }, index * 800);
  
      if (index > 0) {
        const unhighlightTimeout = window.setTimeout(() => {
          const prevNodeId = pathIds[index - 1];
          console.log(`Unhighlighting node: ${prevNodeId}`);
          setNodes((old) =>
            old.map((node) =>
              node.id === prevNodeId ? { ...node, isHighlighted: false } : node
            )
          );
        }, index * 800);
        timeoutsRef.current.push(unhighlightTimeout);
      }
  
      timeoutsRef.current.push(highlightTimeout);
    });
  
    // Unhighlight the last node after the last highlight
    if (pathIds.length > 0) {
      const finalUnhighlightTimeout = window.setTimeout(() => {
        const lastNodeId = pathIds[pathIds.length - 1];
        console.log(`Final unhighlighting of node: ${lastNodeId}`);
        setNodes((old) =>
          old.map((node) =>
            node.id === lastNodeId ? { ...node, isHighlighted: false } : node
          )
        );
      }, pathIds.length * 800);
      timeoutsRef.current.push(finalUnhighlightTimeout);
    }
  };
  

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return highlightPathFromLeaf;
};

export default useHighlightPath;
