import { useState } from "react";
import SegmentTree from "../../assets/JS_complied_algorithms/SegmentTreeClean.js";

export function useSegmentTree(initialData: number[]) {
  const [data, setData] = useState<number[]>(initialData);
  const [segmentTree, setSegmentTree] = useState(() => new SegmentTree(data));

  const rebuildTree = (newData: number[]) => {
    const newST = new SegmentTree(newData);
    setData(newData);
    setSegmentTree(newST);
  };

  return {
    data,
    segmentTree,
    setData,
    rebuildTree
  };
}
