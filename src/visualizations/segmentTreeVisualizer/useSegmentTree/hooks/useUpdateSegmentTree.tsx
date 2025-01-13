import { useCallback } from "react";
import SegmentTreeWasm from "../../../SegmentTreeWasm";
import { VisNode } from "../../../visualisationComponents/nodeAnimations/types/VisNode";
import {
  animateNodeMove,
  animateNodeAppear,
  animateNodeDisappear
} from "../../../visualisationComponents/nodeAnimations/nodeAnimations";
import { buildParentMap } from "../../../visualisationComponents/nodeAnimations/utils/buildParentMap";
import Konva from "konva";

interface UseUpdateSegmentTreeProps {
  nodes: VisNode[];
  setNodes: React.Dispatch<React.SetStateAction<VisNode[]>>;
  parentMap: Record<string, string>;
  setParentMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  segmentTree: SegmentTreeWasm | null;
  shapeRefs: React.MutableRefObject<Record<string, Konva.Circle>>;
}

interface UseUpdateSegmentTreeReturn {
  updateTreeWithNewData: (newData: number[]) => Promise<VisNode[] | null>;
}

export default function useUpdateSegmentTree({
  nodes,
  setNodes,
  parentMap,
  setParentMap,
  segmentTree,
  shapeRefs
}: UseUpdateSegmentTreeProps): UseUpdateSegmentTreeReturn {
  const updateTreeWithNewData = useCallback(
    async (newData: number[]): Promise<VisNode[] | null> => {
      if (!segmentTree) {
        console.error("SegmentTreeWasm instance is not initialized.");
        return null;
      }
      try {
        // Ставим новые данные и перестраиваем
        await segmentTree.setData(newData);
        const rawNodes = await segmentTree.getTreeForVisualization();

        // Адаптер к VisNode
        const newVisNodes: VisNode[] = rawNodes.map((rn) => ({
          id: String(rn.id),
          x: rn.x,
          y: rn.y,
          range: rn.range,
          label: rn.label,
          value: rn.value,
          children: rn.children.map(String)
        }));

        console.log("Обновлённые узлы:", newVisNodes);

        const newParentMap = buildParentMap(newVisNodes);
        console.log("Новая parentMap:", newParentMap);

        // Анимация: исчезновение удалённых
        const removedNodes = nodes.filter((oldNode) =>
          !newVisNodes.some((n) => n.id === oldNode.id)
        );
        removedNodes.forEach((rn) => {
          animateNodeDisappear(rn.id, shapeRefs.current);
        });

        // Анимация перемещения/появления
        newVisNodes.forEach((newN) => {
          const oldNode = nodes.find((p) => p.id === newN.id);
          if (oldNode) {
            if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
              animateNodeMove(newN.id, newN.x, newN.y, shapeRefs.current, newParentMap);
            }
          } else {
            setTimeout(() => {
              animateNodeAppear(newN.id, newN.x, newN.y, shapeRefs.current);
            }, 500);
          }
        });

        // Обновляем стейт
        setParentMap(newParentMap);
        setNodes(newVisNodes);

        return newVisNodes;
      } catch (error) {
        console.error("Ошибка при обновлении дерева:", error);
        return null;
      }
    },
    [nodes, segmentTree, shapeRefs, setNodes, setParentMap]
  );

  return { updateTreeWithNewData };
}
