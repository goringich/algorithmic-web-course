import { VisNode } from "../../../types/VisNode";
import { animateNodeDisappear } from "../../../visualisationComponents/nodeAnimations/nodeAnimations";
import Konva from "konva";

type HandleAddElementParams = {
  newValue: string;
  setNewValue: React.Dispatch<React.SetStateAction<string>>;
  data: number[];
  setData: React.Dispatch<React.SetStateAction<number[]>>;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  MAX_LEAVES: number;
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
  // Параметр buildTree удалён, так как не используется
  setParentMap: React.Dispatch<React.SetStateAction<Record<number, number | undefined>>>;
};

export const handleAddElement = async ({
  newValue, 
  setNewValue, 
  data, 
  setData, 
  setSnackbarMessage, 
  setSnackbarOpen, 
  MAX_LEAVES, 
  updateTreeWithNewData, 
  setParentMap
}: HandleAddElementParams) => {
  if (newValue.trim() === "") {
    setSnackbarMessage("Введите значение для нового элемента.");
    setSnackbarOpen(true);
    return;
  }
  const value = parseInt(newValue, 10);
  if (isNaN(value)) {
    setSnackbarMessage("Неверный формат числа.");
    setSnackbarOpen(true);
    return;
  }
  if (data.length >= MAX_LEAVES) {
    setSnackbarMessage(`Максимальное количество листьев (${MAX_LEAVES}) достигнуто.`);
    setSnackbarOpen(true);
    return;
  }
  const updatedData = [...data, value];
  const newVisNodes = await updateTreeWithNewData(updatedData);
  if (!newVisNodes) {
    setSnackbarMessage("Ошибка при добавлении нового элемента.");
    setSnackbarOpen(true);
    return;
  }
  setData(updatedData);
  setNewValue("");
};

type HandleUpdateNodeParams = {
  selectedNode: VisNode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<VisNode | null>>;
  delta: number;
  setDelta: React.Dispatch<React.SetStateAction<number>>;
  data: number[];
  setData: React.Dispatch<React.SetStateAction<number[]>>;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // Обновлён тип parentMap:
  parentMap: Record<number, number | undefined>;
  highlightPathFromLeaf: (leafId: number) => void;
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
};

export const handleUpdateNode = async ({
  selectedNode, 
  setSelectedNode, 
  delta, 
  setDelta, 
  data, 
  setData, 
  setSnackbarMessage, 
  setSnackbarOpen, 
  parentMap, 
  highlightPathFromLeaf, 
  updateTreeWithNewData
}: HandleUpdateNodeParams) => {
  if (!selectedNode) {
    setSnackbarMessage("Выберите узел для обновления.");
    setSnackbarOpen(true);
    return;
  }
  const [start, end] = selectedNode.range;
  if (start !== end) {
    setSnackbarMessage("Можно обновлять только листовые узлы.");
    setSnackbarOpen(true);
    return;
  }
  const updatedData = [...data];
  updatedData[start] = delta;
  const newVisNodes = await updateTreeWithNewData(updatedData);
  if (!newVisNodes) {
    setSnackbarMessage("Ошибка при обновлении узла.");
    setSnackbarOpen(true);
    return;
  }
  const leafNode = newVisNodes.find(n => n.range[0] === start && n.range[1] === end);
  if (!leafNode) {
    console.error(`Leaf node for range [${start}, ${end}] not found.`);
    setSnackbarMessage(`Узел [${start}, ${end}] не найден.`);
    setSnackbarOpen(true);
    return;
  }
  if (Object.keys(parentMap).length === 0) {
    console.warn("Skipping highlight: parentMap is empty.");
    setSnackbarMessage("parentMap пуст. Подсветка невозможна.");
    setSnackbarOpen(true);
    return;
  }
  highlightPathFromLeaf(leafNode.id);
  setSnackbarMessage(`Значение узла [${start},${end}] обновлено до ${delta}`);
  setSnackbarOpen(true);
  setSelectedNode(null);
};


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

  // Дожидаемся завершения анимации исчезновения
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


type HandleNodeClickParams = {
  node: VisNode;
  setSelectedNode: React.Dispatch<React.SetStateAction<VisNode | null>>;
  setDelta: React.Dispatch<React.SetStateAction<number>>;
};

export const handleNodeClick = ({
  node, 
  setSelectedNode, 
  setDelta 
}: HandleNodeClickParams) => {
  if (node.range[0] === node.range[1]) {
    setSelectedNode(node);
    setDelta(node.value);
  }
};

type HandleCloseSnackbarParams = {
  setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const handleCloseSnackbar = ({
  setSnackbarOpen
}: HandleCloseSnackbarParams) => {
  setSnackbarOpen(false);
};
