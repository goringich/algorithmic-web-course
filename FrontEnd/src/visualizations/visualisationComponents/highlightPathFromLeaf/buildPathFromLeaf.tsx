import { VisNode } from "../nodeAnimations/types/VisNode";

export const buildPathFromLeaf = (
  leafNodeId: string,
  nodes: VisNode[],
  parentMap: Record<string, string>
): string[] => {
  const pathIds: string[] = [];
  let currentId: string | undefined = leafNodeId;
  const visited = new Set<string>();

  while (currentId !== undefined && !visited.has(currentId)) {
    pathIds.push(currentId);
    visited.add(currentId);

    const currentNode = nodes.find((n) => n.id === currentId);
    if (!parentMap[currentId]) {
      console.error(`No parent found for node '${currentId}'`);
      break;
    }
    const pId = parentMap[currentId];
    if (!pId) break;

    if (pId === currentId) {
      // Достигли корня (сам себе родитель)
      break;
    }
    currentId = pId;
  }

  return pathIds;
};
