import { VisNode } from "../../../types/VisNode";

export const buildPathFromLeaf = (
  leafNodeId: number,
  nodes: VisNode[],
  parentMap: Record<number, number | undefined>
): number[] => {
  const pathIds: number[] = [];
  const visited = new Set<number>();
  let currentId: number | undefined = leafNodeId;
  while (currentId !== undefined) {
    if (visited.has(currentId)) {
      console.error(`Cycle detected (Обнаружен цикл) at node '${currentId}'.`);
      break;
    }
    visited.add(currentId);
    pathIds.push(currentId);
    if (parentMap[currentId] === undefined) break;
    const parentId: number | undefined = parentMap[currentId];
    if (parentId === currentId) break;
    currentId = parentId;
  }
  return pathIds;
};
