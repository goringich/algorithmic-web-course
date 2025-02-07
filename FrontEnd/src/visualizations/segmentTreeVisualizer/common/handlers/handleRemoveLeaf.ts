import { VisNode } from "../../../types/VisNode";
import { animateNodeDisappear } from "../../../visualisationComponents/nodeAnimations/animateNodeDisappear";
import Konva from "konva";

type HandleRemoveLeafParams = {
  selectedNode: VisNode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<VisNode | null>>;
  data: number[];
  setData: React.Dispatch<React.SetStateAction<number[]>>;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  parentMap: Record<number, number | undefined>;
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>; 
};

export const handleRemoveLeaf = async ({
  selectedNode, 
  setSelectedNode, 
  data, 
  setData, 
  setSnackbarMessage, 
  setSnackbarOpen, 
  parentMap, 
  updateTreeWithNewData, 
  shapeRefs 
}: HandleRemoveLeafParams) => {
  if (!selectedNode) {
    setSnackbarMessage("Выберите узел для удаления.");
    setSnackbarOpen(true);
    return;
  }
  const [start, end] = selectedNode.range;
  if (start !== end) {
    setSnackbarMessage("Можно удалять только листовые узлы.");
    setSnackbarOpen(true);
    return;
  }
  const pos = selectedNode.range[0];

  try {
    await animateNodeDisappear(selectedNode.id, shapeRefs.current as unknown as Record<number, Konva.Circle>);
  } catch (error) {
    console.error("Ошибка при анимации удаления узла:", error);
    setSnackbarMessage("Ошибка при анимации удаления узла.");
    setSnackbarOpen(true);
    return;
  }

  const newArr = [...data];
  newArr.splice(pos, 1);

  const newVisNodes = await updateTreeWithNewData(newArr);
  if (!newVisNodes) {
    setSnackbarMessage("Ошибка при удалении узла.");
    setSnackbarOpen(true);
    return;
  }
  setData(newArr);
  setSelectedNode(null);
};