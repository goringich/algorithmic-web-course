import { VisNode } from "../../../types/VisNode";

type HandleAddElementParams = {
  newValue: string;
  setNewValue: React.Dispatch<React.SetStateAction<string>>;
  data: number[];
  setData: React.Dispatch<React.SetStateAction<number[]>>;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  MAX_LEAVES: number;
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
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