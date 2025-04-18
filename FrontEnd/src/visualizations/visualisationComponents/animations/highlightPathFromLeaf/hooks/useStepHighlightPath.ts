import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../store/store";
import { buildPathFromLeaf } from "../buildPathFromLeaf";
import { setHighlightedNodes } from "../../../../store/slices/segmentTreeSlice";

export default function useStepHighlightPath() {
  const dispatch = useDispatch<AppDispatch>();
  const { nodes, parentMap } = useSelector((state: RootState) => state.segmentTree);
  const [path, setPath] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const initHighlightPath = useCallback(
    (leafNodeId: number) => {
      const leafNode = nodes.find((node) => node.id === leafNodeId);
      if (!leafNode) {
        console.error(`[ERROR] Узел ${leafNodeId} не найден.`);
        return;
      }
      const computedPath = buildPathFromLeaf(leafNode.id, nodes, parentMap);
      if (computedPath.length === 0) {
        console.warn("[WARN] Нет пути для узла:", leafNodeId);
        return;
      }
      setPath(computedPath);
      setCurrentStep(1);
      dispatch(setHighlightedNodes(computedPath.slice(0, 1)));
    },
    [nodes, parentMap, dispatch]
  );

  const nextStep = useCallback(() => {
    if (path.length === 0) return;
    if (currentStep < path.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      dispatch(setHighlightedNodes(path.slice(0, newStep)));
    }
  }, [path, currentStep, dispatch]);

  const previousStep = useCallback(() => {
    if (path.length === 0) return;
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      dispatch(setHighlightedNodes(path.slice(0, newStep)));
    }
  }, [path, currentStep, dispatch]);

  const finishAnimation = useCallback(() => {
    if (path.length === 0) return;
    setCurrentStep(path.length);
    dispatch(setHighlightedNodes(path));
  }, [path, dispatch]);

  const clearAnimation = useCallback(() => {
    setPath([]);
    setCurrentStep(0);
    dispatch(setHighlightedNodes([]));
  }, [dispatch]);

  return { initHighlightPath, nextStep, previousStep, finishAnimation, clearAnimation, currentStep, totalSteps: path.length };
}
