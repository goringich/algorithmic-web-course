import { VisNode } from "../types/VisNode";

export const buildParentMap = (newNodes: VisNode[]): Record<string, string> => {
  const map: Record<string, string> = {};

  // Создаём Set всех ID для быстрого поиска
  const nodeIds = new Set(newNodes.map((node) => node.id));

  for (const node of newNodes) {
    for (const childId of node.children) {
      if (!nodeIds.has(childId)) {
        console.warn(
          `Child node '${childId}' referenced by parent '${node.id}' does not exist in nodes.`
        );
        continue;
      }
      if (map[childId] && map[childId] !== node.id) {
        console.warn(
          `Node '${childId}' has multiple parents: '${map[childId]}' and '${node.id}'`
        );
      }
      map[childId] = node.id;
    }
  }

  // Определяем «корневые» узлы (те, что не имеют родителя)
  const rootNodes = newNodes.filter((node) => !map.hasOwnProperty(node.id));
  if (rootNodes.length === 0) {
    console.error("No root node found in the tree.");
    if (newNodes.length > 0) {
      const firstNodeId = newNodes[0].id;
      map[firstNodeId] = firstNodeId;
      console.log(`Assigned node '${firstNodeId}' as root.`);
    }
  } else if (rootNodes.length > 1) {
    console.warn(
      "Multiple root nodes detected:",
      rootNodes.map((n) => n.id)
    );
    const trueRoot = rootNodes[0];
    rootNodes.slice(1).forEach((root) => {
      map[root.id] = trueRoot.id;
      console.log(`Reassigning root node '${root.id}' to true root '${trueRoot.id}'`);
    });
  }

  if (rootNodes.length > 0) {
    const trueRoot = rootNodes[0];
    map[trueRoot.id] = trueRoot.id; // сам себе родитель
  }

  return map;
};
