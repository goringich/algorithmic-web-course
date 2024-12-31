import React, { createContext } from "react";
import useSegmentTree from "../components/SegmentTreeVisualizer/useSegmentTree";

export const SegmentTreeContext = createContext();

export const SegmentTreeProvider = ({ children }) => {
  const segmentTree = useSegmentTree([5, 8, 6, 3, 2, 7, 2, 6]);

  return (
    <SegmentTreeContext.Provider value={segmentTree}>
      {children}
    </SegmentTreeContext.Provider>
  );
};