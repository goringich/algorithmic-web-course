import Konva from "konva";
import { VisNode } from "../../../../visualisationComponents/nodeAnimations/types/VisNode";

export interface SegmentTreeContextProps {
  data: number[];
  setData: React.Dispatch<React.SetStateAction<number[]>>;

  nodes: VisNode[];
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;

  parentMap: Record<number, number>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;

  selectedNode: VisNode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<VisNode | null>>;

  delta: number;
  setDelta: React.Dispatch<React.SetStateAction<number>>;

  snackbarOpen: boolean;
  setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  snackbarMessage: string;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;

  newValue: string;
  setNewValue: React.Dispatch<React.SetStateAction<string>>;

  shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>;
  layerRef: React.MutableRefObject<Konva.Layer | null>;

  // Позиция и обработчики для драг-переноса модалки
  editBoxPos: { x: number; y: number };
  handleEditBoxMouseDown: (e: React.MouseEvent) => void;
  handleEditBoxMouseMove: (
    e: React.MouseEvent,
    maxWidth: number,
    maxHeight: number,
    boxWidth: number,
    boxHeight: number
  ) => void;
  handleEditBoxMouseUp: (e: React.MouseEvent) => void;

  // Ваши функции
  onAddElement: () => void;
  onUpdateNode: () => void;
  onRemoveLeaf: () => void;
  onNodeClick: (node: VisNode) => void;
  onCloseSnackbar: () => void;

  highlightPathFromLeaf: (leafId: number) => void;

  // Дополнительно (если нужно):
  stageSize: { width: number; height: number };
  setStageSize: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
}