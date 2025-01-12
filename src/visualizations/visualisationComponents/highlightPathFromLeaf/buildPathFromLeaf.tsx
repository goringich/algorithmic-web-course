import { VisNode } from '../nodeAnimations/types/VisNode';

export const buildPathFromLeaf = (
  leafNodeId: number,
  nodes: VisNode[],
  parentMap: Record<number, number>
): number[] => {
  const pathIds: number[] = [];
  let currentId: number | undefined = leafNodeId;
  const visited = new Set<number>();
  let pId: number | undefined = undefined;

  while (currentId !== undefined && !visited.has(currentId)) {
    pathIds.push(currentId);
    visited.add(currentId);
    const currentNode = nodes.find(n => n.id === currentId);
    console.log(`Added to path: '${currentId}' (Range: ${currentNode?.range})`);

    if (!parentMap || !parentMap.hasOwnProperty(currentId)) {
      console.error(`parentMap is undefined or does not contain node '${currentId}'`);
      break;
    }

    pId = parentMap[currentId];
    if (pId === undefined || pId === null) {
      console.error(`No parent found for node '${currentId}'`);
      break;
    }

    const parentNode = nodes.find(n => n.id === pId);
    if (!parentNode) {
      console.error(`Parent node with ID '${pId}' not found in nodes`);
      break;
    }

    console.log(`Parent of '${currentId}': '${pId}' (Range: ${parentNode.range})`);

    if (pId === currentId) { // Достигнут корень
      console.log(`Reached end of path at: '${currentId}' (Range: ${currentNode?.range})`);
      break;
    }
    currentId = pId;
  }

  // Обнаружение цикла, исключая самореференцию корня
  if (pId !== undefined && pId !== currentId && visited.has(pId)) {
    console.error(`Cycle detected at node '${pId}'`);
  }

  console.log(`Final path from leaf to root:`, pathIds.map(id => {
    const node = nodes.find(n => n.id === id);
    return node ? `${id} (Range: ${node.range})` : id;
  }));

  return pathIds;
};
