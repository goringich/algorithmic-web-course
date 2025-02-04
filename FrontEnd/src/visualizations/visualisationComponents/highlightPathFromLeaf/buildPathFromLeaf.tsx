import { VisNode } from "../nodeAnimations/types/VisNode";

export const buildPathFromLeaf = (
  leafNodeId: number,
  nodes: VisNode[],
  parentMap: Record<number, number | undefined>
): number[] => {
  console.log("Building path from leaf (строим путь от листа):", leafNodeId);
  console.log("Parent map (карта родителей):", parentMap);
  const pathIds: number[] = [];
  const visited = new Set<number>();
  let currentId: number | undefined = leafNodeId;
  while (currentId !== undefined) {
    if (visited.has(currentId)) {
      console.error(`Cycle detected at node '${currentId}' (Обнаружен цикл). Stopping path construction.`);
      break;
    }
    visited.add(currentId);
    pathIds.push(currentId);
    console.log("Added node to path (Добавлен узел в путь):", currentId);
    if (parentMap[currentId] === undefined) {
      console.warn(`No parent found for node '${currentId}' (Родитель не найден). Assuming it's root.`);
      break;
    }
    const parentId = parentMap[currentId];
    if (parentId === currentId) {
      console.log(`Reached root node '${currentId}' (Достигнут корневой узел).`);
      break;
    }
    currentId = parentId;
  }
  console.log("Final path (Итоговый путь):", pathIds);
  return pathIds;
};
