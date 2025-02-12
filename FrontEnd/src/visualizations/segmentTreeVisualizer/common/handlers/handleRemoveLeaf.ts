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
  console.log("[DEBUG (отладка)] handleRemoveLeaf: Начало процедуры удаления узла.");
  
  if (!selectedNode) {
    setSnackbarMessage("Выберите узел для удаления.");
    setSnackbarOpen(true);
    console.log("[DEBUG (отладка)] handleRemoveLeaf: Выбранный узел отсутствует.");
    return;
  }

  console.log("[DEBUG (отладка)] handleRemoveLeaf: Данные выбранного узла:", selectedNode);
  console.log("[DEBUG (отладка)] handleRemoveLeaf: Текущий массив данных:", data);

  const [start, end] = selectedNode.range;
  console.log(`[DEBUG (отладка)] handleRemoveLeaf: Диапазон выбранного узла: [${start}, ${end}]`);
  
  if (start !== end) {
    setSnackbarMessage("Можно удалять только листовые узлы.");
    setSnackbarOpen(true);
    console.log("[DEBUG (отладка)] handleRemoveLeaf: Узел не является листовым (диапазон не единичный).");
    return;
  }

  // dataIndex используется для удаления элемента из массива данных
  const dataIndex = start;
  console.log(`[DEBUG (отладка)] handleRemoveLeaf: Вычисленный индекс в массиве данных: ${dataIndex}`);
  
  console.log(
    "[DEBUG (отладка)] handleRemoveLeaf: Текущее значение shapeRefs.current:",
    shapeRefs.current
  );

  try {
    // Для анимации используем ключ, соответствующий node.id,
    // так как именно по этому ключу сохранена ссылка на фигуру
    console.log(`[DEBUG (отладка)] handleRemoveLeaf: Вызываем animateNodeDisappear с ключом ${selectedNode.id}`);
    await animateNodeDisappear(selectedNode.id, shapeRefs.current);
  } catch (error) {
    console.error("Ошибка при анимации удаления узла:", error);
    setSnackbarMessage("Ошибка при анимации удаления узла.");
    setSnackbarOpen(true);
    return;
  }

  const newArr = [...data];
  newArr.splice(dataIndex, 1);
  console.log("[DEBUG (отладка)] handleRemoveLeaf: Новый массив данных после удаления:", newArr);

  try {
    console.log("[DEBUG (отладка)] handleRemoveLeaf: Вызываем updateTreeWithNewData с новыми данными:", newArr);
    const newVisNodes = await updateTreeWithNewData(newArr);
    if (!newVisNodes) {
      throw new Error("Ошибка при удалении узла.");
    }

    setData(newArr);
    setSelectedNode(null);

    console.log("[DEBUG (отладка)] handleRemoveLeaf: Дерево успешно обновлено с новыми данными:", newArr);
  } catch (error) {
    console.error("Ошибка при обновлении дерева:", error);
    setSnackbarMessage("Ошибка при обновлении дерева.");
    setSnackbarOpen(true);
  }

  console.log("[DEBUG (отладка)] handleRemoveLeaf: Завершена процедура удаления. Итоговый массив данных:", newArr);
};
