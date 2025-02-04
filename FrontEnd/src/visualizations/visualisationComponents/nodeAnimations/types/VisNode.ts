// ../../../visualisationComponents/nodeAnimations/types/VisNode.ts
export interface VisNode {
  id: number;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children: number[];  
  parentId: number;
  depth?: number;
  isHighlighted?: boolean;
}
