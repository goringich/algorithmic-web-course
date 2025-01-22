export const fixParentMap = (parentMap: Record<number, number>): Record<number, number> => {
  const newParentMap = { ...parentMap };

  for (const key in parentMap) {
    const nodeId = Number(key);
    if (parentMap[nodeId] === nodeId) {
      console.warn(`Node '${nodeId}' points to itself. Reassigning to root.`);
      newParentMap[nodeId] = Object.keys(parentMap)[0]; // Привязываем к корню
    }
  }

  return newParentMap;
};
