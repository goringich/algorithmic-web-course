import { setNewValue, setSnackbar, updateTreeWithNewData } from "../../../store/segmentTreeSlice";
import { AppDispatch } from "../../../store/store";

export const handleAddElement = async (
  newValue: string, 
  MAX_LEAVES: number,
  dispatch: AppDispatch,
  data: number[]
) => {
  if (newValue.trim() === "") {
    dispatch(setSnackbar({ message: "Введите значение для нового элемента.", open: true }));
    return;
  }
  const value = parseInt(newValue, 10);
  if (isNaN(value)) {
    dispatch(setSnackbar({ message: "Неверный формат числа.", open: true }));
    return;
  }
  if (data.length >= MAX_LEAVES) {
    dispatch(setSnackbar({ message: `Максимальное количество листьев (${MAX_LEAVES}) достигнуто.`, open: true }));
    return;
  }
  
  const updatedData = [...data, value];

  const resultAction = await dispatch(updateTreeWithNewData(updatedData));
  if (updateTreeWithNewData.rejected.match(resultAction)) {
    dispatch(setSnackbar({ message: "Ошибка при добавлении нового элемента.", open: true }));
    return;
  }
  
  dispatch(setNewValue("")); 
};
