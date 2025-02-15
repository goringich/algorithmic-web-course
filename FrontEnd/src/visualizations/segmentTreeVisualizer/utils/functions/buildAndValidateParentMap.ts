import { VisNode } from '../../../types/VisNode';
import { buildParentMap } from '../../../visualisationComponents/nodeAnimations/utils/buildParentMap';
import { validateParentMap } from '../../../visualisationComponents/highlightPathFromLeaf/utils/validateParentMap';
import { fixParentMap } from '../../../visualisationComponents/highlightPathFromLeaf/utils/fixParentMap';

export function buildAndValidateParentMap(
  nodes: VisNode[],
  rootId: number
): Record<number, number | undefined> {
  let parentMap = buildParentMap(nodes);
  if (!validateParentMap(nodes, rootId)) {
    const fixedParentMap = fixParentMap(nodes, parentMap, rootId);
    if (!validateParentMap(nodes, rootId)) {
      throw new Error("Unable to fix parentMap: Cycles (циклы) or orphan nodes (потерянные узлы) remain.");
    }
    parentMap = fixedParentMap;
  }
  nodes.forEach((node) => {
    if (node.id !== rootId && parentMap[node.id] === undefined) {
      parentMap[node.id] = rootId;
    }
  });
  return parentMap;
}
