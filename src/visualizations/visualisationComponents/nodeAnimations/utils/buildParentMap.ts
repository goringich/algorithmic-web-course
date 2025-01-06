import { VisNode } from '../../VisNode';

export const buildParentMap = (newNodes: VisNode[]): Record<string, string> => {
  const map: Record<string, string> = {};

  // Связываем каждого ребенка с родителем
  for (const node of newNodes) {
    for (const childId of node.children) {
      if (map[childId] && map[childId] !== node.id) {
        console.warn(`Node ${childId} has multiple parents: ${map[childId]} and ${node.id}`);
      }
      map[childId] = node.id;
    }
  }

  // Определяем корневые узлы (узлы без родителей)
  const rootNodes = newNodes.filter(node => map[node.id] === undefined);

  if (rootNodes.length === 0) {
    console.error("No root node found in the tree");
  } else if (rootNodes.length > 1) {
    console.warn("Multiple root nodes detected:", rootNodes.map(n => n.id));
    // Присоединяем все дополнительные корни к первому корню
    const trueRoot = rootNodes[0];
    rootNodes.slice(1).forEach(root => {
      map[root.id] = trueRoot.id;
      console.log(`Reassigning root node ${root.id} to true root ${trueRoot.id}`);
    });
  }

  // Назначаем самореференцию для истинного корня
  if (rootNodes.length > 0) {
    const trueRoot = rootNodes[0];
    map[trueRoot.id] = trueRoot.id;
    console.log(`True root detected: ${trueRoot.id}`);
  }

  console.log("Final parentMap:", map);
  return map;
};
