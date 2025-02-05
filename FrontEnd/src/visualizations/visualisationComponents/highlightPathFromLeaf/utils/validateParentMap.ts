import { VisNode } from "../../../types/VisNode";

export const validateParentMap = (nodes: VisNode[], rootId: number): Record<number, number | undefined> => {
  const parentMap: Record<number, number | undefined> = {};
  nodes.forEach(node => {
    if (node.id === rootId) {
      parentMap[node.id] = undefined; // Root has no parent
    } else {
      parentMap[node.id] = node.parentId; // Ensure each node has a valid parentId
    }
  });
  return parentMap;
};

