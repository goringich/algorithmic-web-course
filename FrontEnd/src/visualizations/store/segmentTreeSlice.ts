// segmentTreeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import SegmentTreeWasm from "../segmentTreeVisualizer/SegmentTreeWasm";
import { VisNode } from "../types/VisNode";
import { normalizeVisNodes } from "../segmentTreeVisualizer/utils/functions/normalizeVisNodes";
import { buildAndValidateParentMap } from "../segmentTreeVisualizer/utils/functions/buildAndValidateParentMap";

interface SegmentTreeState {
  data: number[];
  nodes: VisNode[];
  parentMap: Record<number, number | undefined>;
  selectedNode: VisNode | null;
  delta: number;
  snackbarOpen: boolean;
  snackbarMessage: string;
  newValue: string;
  stageSize: { width: number; height: number };
}

const initialState: SegmentTreeState = {
  data: [],
  nodes: [],
  parentMap: {},
  selectedNode: null,
  delta: 0,
  snackbarOpen: false,
  snackbarMessage: "",
  newValue: "",
  stageSize: { width: 1200, height: 500 },
};

let segmentTreeWasmInstance: SegmentTreeWasm | null = null;

/**
 * Thunk для полной перестройки дерева на основе нового массива данных.
 */
export const updateTreeWithNewData = createAsyncThunk<
  { nodes: VisNode[]; data: number[]; parentMap: Record<number, number | undefined> },
  number[],
  { rejectValue: string }
>(
  "segmentTree/updateTreeWithNewData",
  async (newData, { rejectWithValue }) => {
    try {
      segmentTreeWasmInstance = new SegmentTreeWasm(newData);
      await segmentTreeWasmInstance.setData(newData);

      let nodes = await segmentTreeWasmInstance.getTreeForVisualization();
      nodes = normalizeVisNodes(nodes);

      if (nodes.length === 0) {
        throw new Error("Дерево не было построено.");
      }

      const rootId = nodes[0].id;
      const parentMap = buildAndValidateParentMap(nodes, rootId);

      return { nodes, data: newData, parentMap };
    } catch (error) {
      return rejectWithValue("Ошибка при обновлении дерева через WASM модуль.");
    }
  }
);

const segmentTreeSlice = createSlice({
  name: "segmentTree",
  initialState,
  reducers: {
    setNewValue(state, action: PayloadAction<string>) {
      state.newValue = action.payload;
    },
    setSelectedNode(state, action: PayloadAction<VisNode | null>) {
      state.selectedNode = action.payload;
    },
    setDelta(state, action: PayloadAction<number>) {
      state.delta = action.payload;
    },
    setSnackbar(state, action: PayloadAction<{ message: string; open: boolean }>) {
      state.snackbarMessage = action.payload.message;
      state.snackbarOpen = action.payload.open;
    },
    setStageSize(state, action: PayloadAction<{ width: number; height: number }>) {
      state.stageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateTreeWithNewData.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.nodes = action.payload.nodes;
      state.parentMap = action.payload.parentMap;
    });
    builder.addCase(updateTreeWithNewData.rejected, (state, action) => {
      state.snackbarMessage = action.payload || "Ошибка обновления.";
      state.snackbarOpen = true;
    });
  },
});

export const {
  setNewValue,
  setSelectedNode,
  setDelta,
  setSnackbar,
  setStageSize,
} = segmentTreeSlice.actions;

export default segmentTreeSlice.reducer;
