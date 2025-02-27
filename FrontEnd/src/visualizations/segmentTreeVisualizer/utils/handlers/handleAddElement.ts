import { setNewValue, setSnackbar, updateTreeWithNewData } from "../../../store/segmentTreeSlice";
import { AppDispatch } from "../../../store/store";

export const handleAddElement = async (
  newValue: number,
  MAX_LEAVES: number,
  dispatch: AppDispatch,
  data: number[]
) => {
  if (isNaN(newValue)) {
    console.error("Ошибка: newValue не является числом:", newValue);
    return;
  }

  if (data.length >= MAX_LEAVES) {
    dispatch(setSnackbar({ message: `Максимальное количество листьев (${MAX_LEAVES}) достигнуто.`, open: true }));
    return;
  }

  const updatedData = [...data, newValue];

  try {
    const resultAction = await dispatch(updateTreeWithNewData({ newData: updatedData }));
    if (updateTreeWithNewData.rejected.match(resultAction)) {
      throw new Error("Ошибка при обновлении дерева");
    }
    dispatch(setNewValue("0"));
  } catch (error) {
    console.error("Ошибка при добавлении нового элемента:", error);
    dispatch(setSnackbar({ message: "Ошибка при добавлении нового элемента.", open: true }));
  }
};
