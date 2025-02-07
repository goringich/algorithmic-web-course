export const fixParentMap = (parentMap: Record<number, number | undefined>, rootId: number): Record<number, number | undefined> => {
  const newParentMap: Record<number, number | undefined> = { ...parentMap };

  for (const nodeId in newParentMap) {
    const currentId = Number(nodeId);

    if (currentId === rootId) {
      newParentMap[currentId] = undefined;
      continue;
    }

    let current: number | undefined = currentId;
    const visitedLocal = new Set<number>();

    while (current !== undefined) {
      if (visitedLocal.has(current)) {
        console.warn(`Cycle detected at node '${current}'. Reassigning to root.`);
        newParentMap[current] = rootId;
        break;
      }

      if (current === rootId) break;

      visitedLocal.add(current);
      const parent: number | undefined = newParentMap[current];

      if (parent === current) {
        console.warn(`Node '${current}' points to itself. Reassigning to root.`);
        newParentMap[current] = rootId;
        break;
      }

      current = parent ?? undefined; 
    }

    // Assign orphan nodes to root
    if (newParentMap[currentId] === undefined && currentId !== rootId) {
      console.warn(`Node '${currentId}' is an orphan. Assigning to root.`);
      newParentMap[currentId] = rootId;
    }
  }

  return newParentMap;
};
