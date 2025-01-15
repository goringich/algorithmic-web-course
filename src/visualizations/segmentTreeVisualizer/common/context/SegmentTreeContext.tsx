import React, { createContext, useContext, useRef, useState } from "react";
import { SegmentTreeContextProps } from "./SegmentTreeContextProps";

// Создаём Context
const SegmentTreeContext = createContext<SegmentTreeContextProps | undefined>(undefined);

// Хук для использования контекста
export const useSegmentTreeContext = () => {
  const context = useContext(SegmentTreeContext);
  if (!context) {
    throw new Error('useSegmentTreeContext must be used within a SegmentTreeProvider');
  }
  return context;
};
