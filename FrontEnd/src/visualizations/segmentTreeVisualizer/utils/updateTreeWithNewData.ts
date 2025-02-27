import { createAsyncThunk } from "@reduxjs/toolkit";
import { VisNode } from "../../types/VisNode";
import SegmentTreeWasm from "../SegmentTreeWasm";
import Konva from "konva";
import { normalizeVisNodes } from "./functions/normalizeVisNodes";
import { buildAndValidateParentMap } from "./functions/buildAndValidateParentMap";
// Импортируйте setTree из вашего slice – проверьте корректный путь:
import { setTree } from "../../store/segmentTreeSlice";

// Хранение экземпляра WASM-модуля на уровне модуля
let segmentTreeWasmInstance: SegmentTreeWasm | null = null;

interface UpdateTreeParams {
  newData: number[];
  twoPhase?: boolean;
}

export const updateTreeWithNewData = createAsyncThunk<
  { nodes: VisNode[]; data: number[]; parentMap: Record<number, number | undefined> },
  UpdateTreeParams,
  { rejectValue: string }
>(
  "segmentTree/updateTreeWithNewData",
  async ({ newData, twoPhase = false }, { dispatch, rejectWithValue }) => {
    try {
      console.log("[DEBUG] Начало updateTreeWithNewData, newData =", newData);

      // 1. Создаём новый экземпляр дерева
      segmentTreeWasmInstance = new SegmentTreeWasm(newData);
      console.log("[DEBUG] SegmentTreeWasm instance создан.");

      // 2. Устанавливаем данные
      await segmentTreeWasmInstance.setData(newData);
      console.log("[DEBUG] Данные установлены в SegmentTreeWasm.");

      // 3. Получаем узлы для визуализации
      let nodes = await segmentTreeWasmInstance.getTreeForVisualization();
      console.log("[DEBUG] Получили узлы от getTreeForVisualization:", nodes);

      // 4. Нормализуем узлы
      nodes = normalizeVisNodes(nodes);
      if (nodes.length === 0) {
        throw new Error("Дерево не было построено (узлы пусты).");
      }

      // 5. Формируем parentMap
      const rootId = nodes[0].id;
      const parentMap = buildAndValidateParentMap(nodes, rootId);
      console.log("[DEBUG] parentMap сформирован:", parentMap);

      // 6. Двухфазное обновление
      if (twoPhase) {
        console.log("[DEBUG] Режим twoPhase включен. Сначала показываем листья.");
        // Отображаем только листья
        const leaves = nodes.filter((node) => node.range[0] === node.range[1]);
        dispatch(setTree({ nodes: leaves, data: newData, parentMap }));
        console.log("[DEBUG] Листья переданы в store:", leaves);

        // Задержка 1 секунда
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("[DEBUG] Завершён первый этап двухфазного обновления.");
      }

      // 7. Возвращаем полное дерево
      console.log("[DEBUG] Возвращаем полное дерево из updateTreeWithNewData.");
      return { nodes, data: newData, parentMap };

    } catch (error) {
      console.error("[ERROR in updateTreeWithNewData]", error);
      return rejectWithValue("Ошибка при обновлении дерева через WASM модуль.");
    }
  }
);
