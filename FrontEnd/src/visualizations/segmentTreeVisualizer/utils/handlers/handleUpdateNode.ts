import { setSelectedNode, setSnackbar, setDelta, updateTreeWithNewData } from "../../../store/segmentTreeSlice";
import { AppDispatch } from "../../../store/store";
import { VisNode } from "../../../types/VisNode";

export const handleUpdateNode = async (
  selectedNode: VisNode | null,
  delta: number,
  data: number[],
  dispatch: AppDispatch,
  highlightPathFromLeaf: (leafId: number) => void,
  parentMap: Record<number, number | undefined>
) => {
  if (!selectedNode) {
    dispatch(setSnackbar({ message: "Выберите узел для обновления.", open: true }));
    return;
  }
  const [start, end] = selectedNode.range;
  if (start !== end) {
    dispatch(setSnackbar({ message: "Можно обновлять только листовые узлы.", open: true }));
    return;
  }
  
  const updatedData = [...data];
  updatedData[start] = delta;
  const resultAction = await dispatch(updateTreeWithNewData(updatedData));
  if (updateTreeWithNewData.rejected.match(resultAction)) {
    dispatch(setSnackbar({ message: "Ошибка при обновлении узла.", open: true }));
    return;
  }
  
  const newVisNodes = (resultAction.payload as { nodes: VisNode[] }).nodes;
  const leafNode = newVisNodes.find(n => n.range[0] === start && n.range[1] === end);
  if (!leafNode) {
    dispatch(setSnackbar({ message: `Узел [${start}, ${end}] не найден.`, open: true }));
    return;
  }
  
  if (Object.keys(parentMap).length === 0) {
    dispatch(setSnackbar({ message: "parentMap пуст. Подсветка невозможна.", open: true }));
    return;
  }
  
  // Даем небольшую задержку, чтобы дерево обновилось,
  // и затем запускаем анимацию подсветки пути.
  setTimeout(() => {
    highlightPathFromLeaf(leafNode.id);
  }, 100);
  
  dispatch(setSnackbar({ message: `Значение узла [${start},${end}] обновлено до ${delta}`, open: true }));
  dispatch(setSelectedNode(null));
  dispatch(setDelta(0));
};
