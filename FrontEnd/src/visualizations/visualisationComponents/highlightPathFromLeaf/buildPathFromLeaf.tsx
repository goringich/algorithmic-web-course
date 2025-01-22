import { VisNode } from "../nodeAnimations/types/VisNode";

export const buildPathFromLeaf = (
  leafNodeId: number,
  nodes: VisNode[],
  parentMap: Record<number, number>
): number[] => {
  const pathIds: number[] = [];
  const visited = new Set<number>(); // Для предотвращения циклов
  let currentId: number | undefined = leafNodeId;

  while (currentId !== undefined) {
    if (visited.has(currentId)) {
      console.error(`Cycle detected at node '${currentId}'. Stopping path construction.`);
      break;
    }
    visited.add(currentId);
    pathIds.push(currentId);

    if (!parentMap[currentId]) {
      console.error(`No parent found for node '${currentId}'. Path construction stopped.`);
      break;
    }

    const parentId = parentMap[currentId];
    if (parentId === currentId) {
      // Достигли корня дерева
      break;
    }

    currentId = parentId;
  }

  return pathIds;
};



