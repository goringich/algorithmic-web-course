export const validateParentMap = (parentMap: Record<number, number>): boolean => {
  const visited = new Set<number>();

  for (const key in parentMap) {
    const nodeId = Number(key);
    let current = nodeId;
    visited.clear();

    while (current !== undefined) {
      if (visited.has(current)) {
        console.error(`Cycle detected in parentMap at node '${current}'.`);
        return false;
      }
      visited.add(current);

      if (parentMap[current] === current) {
        console.error(`Node '${current}' points to itself. Invalid parentMap.`);
        return false;
      }

      current = parentMap[current];
    }
  }
  return true;
};
