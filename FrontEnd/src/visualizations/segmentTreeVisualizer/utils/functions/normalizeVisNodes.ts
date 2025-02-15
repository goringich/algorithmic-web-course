import { VisNode } from '../../../types/VisNode';

export function normalizeVisNodes(nodes: VisNode[]): VisNode[] {
  return nodes.map((node, index) => ({
    ...node,
    parentId: node.parentId !== undefined ? node.parentId : (index === 0 ? undefined : 0),
    isHighlighted: false,
    children: node.children as unknown as number[],
  }));
}
