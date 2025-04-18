import { setSelectedNode, setSnackbar, updateTreeWithNewData } from "../../../store/slices/segmentTreeSlice";
import { AppDispatch } from "../../../store/store";
import Konva from "konva";
import { animateNodeDisappear } from "../../../visualisationComponents/animations/nodeAnimations/animateNodeDisappear";
import { VisNode } from "../../../types/VisNode";

export const handleRemoveLeaf = async (
  selectedNode: VisNode | null,
  data: VisNode[], // Здесь тип данных VisNode[]
  dispatch: AppDispatch,
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>
) => {
  if (!selectedNode) {
    dispatch(setSnackbar({ message: "Выберите узел для удаления.", open: true }));
    return;
  }
  const [start, end] = selectedNode.range;
  if (start !== end) {
    dispatch(setSnackbar({ message: "Можно удалять только листовые узлы.", open: true }));
    return;
  }
  const leafIndex = start;

  try {
    // Выполним анимацию исчезновения узла
    await animateNodeDisappear(selectedNode.id, shapeRefs.current);
  } catch (error) {
    console.error("Ошибка при анимации удаления узла:", error);
    dispatch(setSnackbar({ message: "Ошибка при анимации удаления узла.", open: true }));
    return;
  }

  // Перестроение данных дерева без удаления референса на фигуру
  const newData = data.filter((_, idx) => idx !== leafIndex); // Удаляем элемент из данных
  const resultAction = await dispatch(updateTreeWithNewData(newData));
  if (updateTreeWithNewData.rejected.match(resultAction)) {
    dispatch(setSnackbar({ message: "Ошибка при обновлении дерева.", open: true }));
    return;
  }

  // После этого референс на фигуру остаётся, но она исчезает
  dispatch(setSelectedNode(null)); // Сбрасываем выбранный узел
  dispatch(setSnackbar({ message: "Узел удален.", open: true }));
};
