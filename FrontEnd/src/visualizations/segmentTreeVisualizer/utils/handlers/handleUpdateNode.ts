import { AppDispatch } from "../../../store/store";
import { VisNode } from "../../../types/VisNode";
import { setSnackbar, setSelectedNode, setDelta, updateTreeWithNewData } from "../../../store/slices/segmentTreeSlice";

export const handleUpdateNode = async (
  selectedNode: VisNode | null,
  delta: number,
  data: number[],
  dispatch: AppDispatch,
  highlightPathFromLeaf: (leafId: number) => void
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

  // После обновления дерева (tree, дерево) новое состояние подтягивается из Redux,
  // поэтому highlightPathFromLeaf уже использует актуальные данные, включая parentMap.
  setTimeout(() => {
    highlightPathFromLeaf(selectedNode.id);
  }, 800);

  dispatch(setSnackbar({ message: `Узел [${start},${end}] обновлён до ${delta}`, open: true }));
  dispatch(setSelectedNode(null));
  dispatch(setDelta(0));
};
