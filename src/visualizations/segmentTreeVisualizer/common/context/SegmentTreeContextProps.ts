import Konva from "konva";
import { VisNode } from "@src/visualizations/visualisationComponents/nodeAnimations/types/VisNode";

export interface SegmentTreeContextProps {
  nodes: VisNode[];
  parentMap: Record<number, number>;
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>;
  layerRef: React.MutableRefObject<Konva.Layer | null>;
}