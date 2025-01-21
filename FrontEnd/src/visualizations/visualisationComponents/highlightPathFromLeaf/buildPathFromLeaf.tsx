import { VisNode } from "../nodeAnimations/types/VisNode";

export const buildPathFromLeaf = (
  leafNodeId: number,
  nodes: VisNode[],
  parentMap: Record<number, number>
): number[] => {
  const pathIds: number[] = [];
  let currentId: number | undefined = leafNodeId;
  const visited = new Set<number>();

  while (currentId !== undefined && !visited.has(currentId)) {
    pathIds.push(currentId);
    visited.add(currentId);

    if (!parentMap[currentId]) {
      console.error(`No parent found for node '${currentId}'. Adding to orphan list.`);
      break; // Прекращаем обработку, если узел-сирота.
    }

    const parentId = parentMap[currentId];
    if (parentId === currentId) {
      // Достигли корня
      break;
    }

    currentId = parentId;
  }

  return pathIds;
};

