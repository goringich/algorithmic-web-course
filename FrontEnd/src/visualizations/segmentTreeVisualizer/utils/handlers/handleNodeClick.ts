import { setSelectedNode, setDelta } from "../../../store/slices/segmentTreeSlice";
import { AppDispatch } from "../../../store/store";
import { VisNode } from "../../../types/VisNode";

export const handleNodeClick = (node: VisNode, dispatch: AppDispatch) => {
  if (node.range[0] === node.range[1]) {
    dispatch(setSelectedNode(node));
    dispatch(setDelta(node.value));
  }
};
