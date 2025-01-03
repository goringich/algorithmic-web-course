// src/components/SegmentTreeVisualizer/useSegmentTree.js
import { useState, useRef, useEffect } from "react";
import Konva from "konva";
import SegmentTree from "../../assets/JS_complied_algorithms/SegmentTreeClean.js"; // Assuming you move the class to utils

const MAX_LEAVES = 16;

const useSegmentTree = (initialData) => {
  const shapeRefs = useRef({});
  const [data, setData] = useState(initialData);
  const [segmentTree, setSegmentTree] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [parentMap, setParentMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (initialData.length > 0) {
      const st = new SegmentTree(initialData);
      setSegmentTree(st.tree);
      const visNodes = st.getTreeForVisualization();
      setNodes(visNodes);
      setParentMap(buildParentMap(visNodes));
      setIsLoading(false);
    }
  }, [initialData]);

  // Преобразование массива дерева в формат для визуализации
  const convertTreeToVisualization = (tree, size) => {
    const visNodes = [];
    const height = Math.ceil(Math.log2(size)) + 1;

    for (let i = 0; i < tree.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i + 1 - Math.pow(2, level);
      const nodesInLevel = Math.pow(2, level);
      const xSpacing = 800 / nodesInLevel;
      const x = posInLevel * xSpacing + xSpacing / 2;
      const y = 100 + level * 100;

      visNodes.push({
        id: i,
        value: tree[i],
        x,
        y,
        children: getChildrenIndices(i, tree.length),
        isHighlighted: false,
      });
    }

    return visNodes;
  };

  // Получение индексов дочерних узлов
  const getChildrenIndices = (index, treeLength) => {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    const children = [];
    if (left < treeLength) children.push(left);
    if (right < treeLength) children.push(right);
    return children;
  };

  // Построение карты родителей
  const buildParentMap = (newNodes) => {
    const map = {};
    newNodes.forEach((node) => {
      node.children.forEach((childId) => {
        map[childId] = node.id;
      });
    });
    return map;
  };

  // Обновление узлов после изменения дерева
  const refreshNodes = (updatedTree) => {
    const visNodes = convertTreeToVisualization(updatedTree, data.length);
    setNodes(visNodes);
    setParentMap(buildParentMap(visNodes));
  };

  // Обновление дерева с новыми данными
  const updateTreeWithNewData = (newData) => {
    const st = new SegmentTree(newData);
    setSegmentTree(st.tree);
    refreshNodes(st.tree);
  };

  // Добавление элемента
  const handleAddElement = (newValue) => {
    if (newValue === "") return;
    const value = parseInt(newValue, 10);
    if (isNaN(value) || data.length >= MAX_LEAVES) return;

    const updatedData = [...data, value];
    setData(updatedData);
    updateTreeWithNewData(updatedData);
  };

  // Анимации
  const animateNodeMove = (nodeId, newX, newY) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) return;
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      x: newX,
      y: newY,
      easing: Konva.Easings.EaseInOut,
    }).play();
  };

  const animateNodeAppear = (nodeId, finalX, finalY) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) return;
    shape.scale({ x: 0, y: 0 });
    shape.y(finalY - 50);
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      scaleX: 1,
      scaleY: 1,
      y: finalY,
      easing: Konva.Easings.EaseOut,
    }).play();
  };

  const animateNodeDisappear = (nodeId, callback) => {
    const shape = shapeRefs.current[nodeId];
    if (!shape) {
      if (callback) callback();
      return;
    }
    new Konva.Tween({
      node: shape,
      duration: 0.5,
      scaleX: 0,
      scaleY: 0,
      easing: Konva.Easings.EaseIn,
      onFinish: () => {
        if (callback) callback();
      },
    }).play();
  };

  // Подсветка пути от листа к корню
  const highlightPathFromLeaf = (leafNodeId) => {
    if (leafNodeId === undefined || !parentMap) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let currentId = leafNodeId;
    const pathIds = [];
    while (currentId !== undefined) {
      pathIds.push(currentId);
      currentId = parentMap[currentId];
    }

    let i = 0;
    intervalRef.current = setInterval(() => {
      setNodes((old) =>
        old.map((node) => ({
          ...node,
          isHighlighted: pathIds.includes(node.id) && node.id === pathIds[i],
        }))
      );
      i++;
      if (i >= pathIds.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 800);
  };

  // Очистка интервала при размонтировании
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    setData,
    segmentTree,
    nodes,
    setNodes,
    parentMap,
    setParentMap,
    shapeRefs,
    handleAddElement,
    updateTreeWithNewData,
    refreshNodes,
    highlightPathFromLeaf,
    animateNodeMove,
    animateNodeAppear,
    animateNodeDisappear,
    isLoading,
  };
};

export default useSegmentTree;
