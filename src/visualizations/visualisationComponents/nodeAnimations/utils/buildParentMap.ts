// utils/buildParentMap.ts
import { VisNode } from '../types/VisNode';

export const buildParentMap = (newNodes: VisNode[]): Record<number, number> => {
  const map: Record<number, number> = {};

  // Создаем множество идентификаторов узлов для быстрого поиска
  const nodeIds = new Set(newNodes.map(node => node.id));

  // Связываем каждого ребенка с родителем
  for (const node of newNodes) {
    for (const childId of node.children) {
      if (!nodeIds.has(childId)) {
        console.warn(`Child node '${childId}' referenced by parent '${node.id}' does not exist in nodes.`);
        continue; // Пропускаем добавление в карту, так как ребенок отсутствует в nodes
      }

      if (map[childId] && map[childId] !== node.id) {
        console.warn(`Node '${childId}' has multiple parents: '${map[childId]}' and '${node.id}'`);
      }
      map[childId] = node.id;
    }
  }

  // Определяем корневые узлы (узлы без родителей)
  const rootNodes = newNodes.filter(node => !map.hasOwnProperty(node.id));

  if (rootNodes.length === 0) {
    console.error("No root node found in the tree.");
    // Опционально: назначаем первый узел как корень, если он существует
    if (newNodes.length > 0) {
      const firstNodeId = newNodes[0].id;
      map[firstNodeId] = firstNodeId;
      console.log(`Assigned node '${firstNodeId}' as root.`);
    }
  } else if (rootNodes.length > 1) {
    console.warn("Multiple root nodes detected:", rootNodes.map(n => n.id));
    // Присоединяем все дополнительные корни к первому корню
    const trueRoot = rootNodes[0];
    rootNodes.slice(1).forEach(root => {
      map[root.id] = trueRoot.id;
      console.log(`Reassigning root node '${root.id}' to true root '${trueRoot.id}'`);
    });
  }

  // Назначаем самореференцию для истинного корня
  if (rootNodes.length > 0) {
    const trueRoot = rootNodes[0];
    map[trueRoot.id] = trueRoot.id;
    console.log(`True root detected: '${trueRoot.id}'`);
  }

  console.log("Final parentMap:", map);

  return map;
};
