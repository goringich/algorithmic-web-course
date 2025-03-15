import { createAsyncThunk } from "@reduxjs/toolkit";
import { VisNode } from "../../types/VisNode";
import SegmentTreeWasm from "../SegmentTreeWasm";
import Konva from "konva";
// import { waitForLayerRef } from "./functions/waitForLayerRef";
import { normalizeVisNodes } from "./functions/normalizeVisNodes";
import { buildAndValidateParentMap } from "./functions/buildAndValidateParentMap";

interface UpdateTreeParams {
  newData: number[];
  shapeRefs: React.MutableRefObject<Record<number, Konva.Circle>>;
  layerRef: React.MutableRefObject<Konva.Layer | null>;
}

export const updateTreeWithNewDataThunk = createAsyncThunk<
  {
    nodes: VisNode[];
    data: number[];
    parentMap: Record<number, number | undefined>;
  },
  UpdateTreeParams,
  { rejectValue: string }
>(
  "segmentTree/updateTreeWithNewData",
  async ({ newData, shapeRefs, layerRef }, { rejectWithValue }) => {
    console.log("[INFO] Starting updateTreeWithNewData with newData:", newData);

    // const currentLayer = await waitForLayerRef(layerRef);
    // if (!currentLayer) {
    //   console.error("[ERROR] layerRef.current is null. Aborting updateTreeWithNewData.");
    //   return rejectWithValue("Layer not available (Слой недоступен)");
    // }

    try {
      // Очищаем словарь ссылок
      shapeRefs.current = {};

      // Создаем новый экземпляр дерева
      const newSegmentTree = new SegmentTreeWasm(newData);
      await newSegmentTree.setData(newData);
      console.log("[INFO] newSegmentTree.setData completed.");

      let newVisNodes: VisNode[] = await newSegmentTree.getTreeForVisualization();
      console.log("[INFO] newSegmentTree.getTreeForVisualization returned:", newVisNodes);

      newVisNodes = normalizeVisNodes(newVisNodes);

      const rootId = newVisNodes[0]?.id;
      if (rootId === undefined) {
        throw new Error("No root node found in the new visualization nodes.");
      }
      console.log(`[INFO] Root node id is ${rootId}`);

      const newParentMap = buildAndValidateParentMap(newVisNodes, rootId);

      console.log("[INFO] Tree update completed successfully.");
      return { nodes: newVisNodes, data: newData, parentMap: newParentMap };
    } catch (error) {
      console.error("[ERROR] Error while updating the tree:", error);
      const errorMsg = error instanceof Error ? error.message : "Error updating tree";
      return rejectWithValue(errorMsg);
    }
  }
);
