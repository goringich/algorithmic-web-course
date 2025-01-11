export const buildParentMap = (newNodes: VisNode[]): Record<string, string> => {
  const map: Record<string, string> = {};

  // Связываем каждого ребенка с родителем
  for (const node of newNodes) {
    for (const childId of node.children) {
      const childIdStr = childId.toString();
      const nodeIdStr = node.id.toString();

      if (map[childIdStr] && map[childIdStr] !== nodeIdStr) {
        console.warn(`Node ${childIdStr} has multiple parents: ${map[childIdStr]} and ${nodeIdStr}`);
      }
      map[childIdStr] = nodeIdStr;
    }
  }

  // Определяем корневые узлы (узлы без родителей)
  const rootNodes = newNodes.filter(node => !map.hasOwnProperty(node.id.toString()));

  if (rootNodes.length === 0) {
    console.error("No root node found in the tree.");
    // Опционально: назначаем '1' как корень, если он присутствует
    const node1 = newNodes.find(node => node.id.toString() === '1');
    if (node1) {
      map['1'] = '1';
      console.log("Assigned node '1' as root.");
    }
  } else if (rootNodes.length > 1) {
    console.warn("Multiple root nodes detected:", rootNodes.map(n => n.id));
    // Присоединяем все дополнительные корни к первому корню
    const trueRoot = rootNodes[0];
    rootNodes.slice(1).forEach(root => {
      map[root.id.toString()] = trueRoot.id.toString();
      console.log(`Reassigning root node ${root.id} to true root ${trueRoot.id}`);
    });
  }

  // Назначаем самореференцию для истинного корня
  if (rootNodes.length > 0) {
    const trueRoot = rootNodes[0];
    map[trueRoot.id.toString()] = trueRoot.id.toString();
    console.log(`True root detected: ${trueRoot.id}`);
  }

  console.log("Final parentMap:", map);
  
  // Проверка наличия узла '1'
  if (!map['1']) {
    console.warn("Parent map does not contain node '1'. Assigning it as root if it exists.");
    const node1 = newNodes.find(node => node.id.toString() === '1');
    if (node1) {
      map['1'] = '1';
      console.log("Assigned node '1' as root.");
    } else {
      console.error("Node '1' is missing in newNodes. Cannot assign as root.");
    }
  }

  return map;
};
