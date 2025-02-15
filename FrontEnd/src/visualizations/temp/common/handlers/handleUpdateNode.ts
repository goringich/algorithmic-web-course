// import { VisNode } from "../../../types/VisNode";

// type HandleUpdateNodeParams = {
//   selectedNode: VisNode | null;
//   setSelectedNode: React.Dispatch<React.SetStateAction<VisNode | null>>;
//   delta: number;
//   setDelta: React.Dispatch<React.SetStateAction<number>>;
//   data: number[];
//   setData: React.Dispatch<React.SetStateAction<number[]>>;
//   setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
//   setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   parentMap: Record<number, number | undefined>;
//   highlightPathFromLeaf: (leafId: number) => void;
//   updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
// };

// export const handleUpdateNode = async ({
//   selectedNode, 
//   setSelectedNode, 
//   delta, 
//   setDelta, 
//   data, 
//   setData, 
//   setSnackbarMessage, 
//   setSnackbarOpen, 
//   parentMap, 
//   highlightPathFromLeaf, 
//   updateTreeWithNewData
// }: HandleUpdateNodeParams) => {
//   if (!selectedNode) {
//     setSnackbarMessage("Выберите узел для обновления.");
//     setSnackbarOpen(true);
//     return;
//   }
//   const [start, end] = selectedNode.range;
//   if (start !== end) {
//     setSnackbarMessage("Можно обновлять только листовые узлы.");
//     setSnackbarOpen(true);
//     return;
//   }
//   const updatedData = [...data];
//   updatedData[start] = delta;
//   const newVisNodes = await updateTreeWithNewData(updatedData);
//   if (!newVisNodes) {
//     setSnackbarMessage("Ошибка при обновлении узла.");
//     setSnackbarOpen(true);
//     return;
//   }
//   const leafNode = newVisNodes.find(n => n.range[0] === start && n.range[1] === end);
//   if (!leafNode) {
//     console.error(`Leaf node for range [${start}, ${end}] not found.`);
//     setSnackbarMessage(`Узел [${start}, ${end}] не найден.`);
//     setSnackbarOpen(true);
//     return;
//   }
//   if (Object.keys(parentMap).length === 0) {
//     console.warn("Skipping highlight: parentMap is empty.");
//     setSnackbarMessage("parentMap пуст. Подсветка невозможна.");
//     setSnackbarOpen(true);
//     return;
//   }
//   highlightPathFromLeaf(leafNode.id);
//   setSnackbarMessage(`Значение узла [${start},${end}] обновлено до ${delta}`);
//   setSnackbarOpen(true);
//   setSelectedNode(null);
// };