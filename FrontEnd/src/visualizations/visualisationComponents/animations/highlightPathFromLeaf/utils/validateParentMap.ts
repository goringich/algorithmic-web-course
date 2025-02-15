import { VisNode } from "../../../../types/VisNode";

export const validateParentMap = (nodes: VisNode[], rootId: number): Record<number, number | undefined> => {
  const parentMap: Record<number, number | undefined> = {};
  nodes.forEach(node => {
    if (node.id === rootId) {
      parentMap[node.id] = undefined; 
    } else {
      parentMap[node.id] = node.parentId; 
    }
  });
  return parentMap;
};

