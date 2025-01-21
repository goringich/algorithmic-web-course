export interface VisNode {
  id: number;
  x: number;
  y: number;
  range: [number, number];
  label: string;
  value: number;
  children?: VisNode[];
  isHighlighted?: boolean;
}
