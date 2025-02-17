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
  // Словарь ref с ключами типа number
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
  console.log("[DEBUG] handleRemoveLeaf: Начало процедуры удаления узла.");
  
  if (!selectedNode) {
    setSnackbarMessage("Выберите узел для удаления.");
    setSnackbarOpen(true);
    console.log("[DEBUG] handleRemoveLeaf: Выбранный узел отсутствует.");
    return;
  }

  console.log("[DEBUG] handleRemoveLeaf: Данные выбранного узла:", selectedNode);
  console.log("[DEBUG] handleRemoveLeaf: Текущий массив данных:", data);

  const [start, end] = selectedNode.range;
  console.log(`[DEBUG] handleRemoveLeaf: Диапазон выбранного узла: [${start}, ${end}]`);

  if (start !== end) {
    setSnackbarMessage("Можно удалять только листовые узлы.");
    setSnackbarOpen(true);
    console.log("[DEBUG] handleRemoveLeaf: Узел не является листовым.");
    return;
  }

  // Используем range[0] как индекс листа в массиве данных
  const leafIndex = start;
  console.log(`[DEBUG] handleRemoveLeaf: Индекс листа для удаления: ${leafIndex}`);

  try {
    console.log(`[DEBUG] handleRemoveLeaf: Вызываем animateNodeDisappear с ключом ${selectedNode.id}`);
    await animateNodeDisappear(selectedNode.id, shapeRefs.current);
  } catch (error) {
    console.error("Ошибка при анимации удаления узла:", error);
    setSnackbarMessage("Ошибка при анимации удаления узла.");
    setSnackbarOpen(true);
    return;
  }

  // Формируем новый массив данных, исключая элемент с индексом leafIndex
  const newData = data.filter((_, idx) => idx !== leafIndex);
  console.log("[DEBUG] handleRemoveLeaf: Новый массив данных после удаления:", newData);

  try {
    const newVisNodes = await updateTreeWithNewData(newData);
    if (!newVisNodes) {
      throw new Error("Ошибка при обновлении дерева.");
    }

    setData(newData);
    setSelectedNode(null);

    console.log("[DEBUG] handleRemoveLeaf: Дерево успешно обновлено с новыми данными:", newData);
  } catch (error) {
    console.error("Ошибка при обновлении дерева:", error);
    setSnackbarMessage("Ошибка при обновлении дерева.");
    setSnackbarOpen(true);
  }

  console.log("[DEBUG] handleRemoveLeaf: Завершена процедура удаления. Итоговый массив данных:", newData);
};
