// src/components/SegmentTreeVisualizer/useSegmentTree.js
import { useState, useRef, useEffect } from "react";
import Konva from "konva";
import createSegmentTreeModule from '../../assets/JS_complied_algorithms/segment_tree.wasm';


const MAX_LEAVES = 16;

const UseSegmentTree = (initialData) => {
  const shapeRefs = useRef({});
  const [data, setData] = useState(initialData);
  const [segmentTree, setSegmentTree] = useState(null); // Будет содержать массив дерева сегментов
  const [nodes, setNodes] = useState([]);
  const [parentMap, setParentMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const wasmModuleRef = useRef(null);

  // Загрузка WebAssembly модуля и инициализация SegmentTree
  useEffect(() => {
    let isMounted = true;

    const loadWasm = async () => {
      try {
        const wasmUrl = '../../assets/JS_complied_algorithms/segment_tree.wasm';
        const wasmModule = await WebAssembly.instantiateStreaming(fetch(wasmUrl), imports);
        console.log('Экспортируемые функции:', Object.keys(wasmModule));
        console.log(wasmModule);

        wasmModuleRef.current = wasmModule;

        // Устанавливаем массив данных
        wasmModule.setArray(initialData);

        // Строим дерево
        wasmModule.buildTree(0, 0, initialData.length - 1);

        // Получаем построенное дерево
        const tree = wasmModule.getTree();

        if (isMounted) {
          setSegmentTree(tree);
          const visNodes = convertTreeToVisualization(tree, initialData.length);
          setNodes(visNodes);
          const map = buildParentMap(visNodes);
          setParentMap(map);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading WebAssembly module:", error);
        setIsLoading(false);
      }
    };

    loadWasm();

    return () => {
      isMounted = false;
    };
  }, [initialData]);

  // Преобразование массива дерева сегментов из C++ в формат для визуализации
  const convertTreeToVisualization = (tree, size) => {
    const visNodes = [];
    const height = Math.ceil(Math.log2(size)) + 1; // Высота дерева

    // Определяем позиции узлов
    for (let i = 0; i < tree.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i + 1 - Math.pow(2, level);
      const nodesInLevel = Math.pow(2, level);
      const xSpacing = 800 / nodesInLevel; // Ширина канваса (например, 800)
      const x = posInLevel * xSpacing + xSpacing / 2;
      const y = 100 + level * 100; // Высота между уровнями (например, 100)

      visNodes.push({
        id: i,
        value: tree[i],
        x: x,
        y: y,
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

  // Построение карты родительских узлов
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
    // Анимации исчезновения узлов, которых нет в новом дереве
    setNodes((prev) => {
      const removed = prev.filter(
        (oldNode) => !visNodes.some((n) => n.id === oldNode.id)
      );
      removed.forEach((rn) => {
        animateNodeDisappear(rn.id);
      });
      return prev;
    });

    // Обновление узлов и анимация перемещений или появления
    setNodes((prevNodes) => {
      visNodes.forEach((newN) => {
        const oldNode = prevNodes.find((p) => p.id === newN.id);
        if (oldNode) {
          if (oldNode.x !== newN.x || oldNode.y !== newN.y) {
            animateNodeMove(newN.id, newN.x, newN.y);
          }
        } else {
          setTimeout(() => {
            animateNodeAppear(newN.id, newN.x, newN.y);
          }, 50);
        }
      });
      return visNodes;
    });

    // Обновление parentMap
    const map = buildParentMap(visNodes);
    setParentMap(map);
  };

  // Обновление дерева с новыми данными
  const updateTreeWithNewData = (newData) => {
    if (!wasmModuleRef.current) return;

    try {
      wasmModuleRef.current.setArray(newData);
      wasmModuleRef.current.buildTree(0, 0, newData.length - 1);
      const tree = wasmModuleRef.current.getTree();
      setSegmentTree(tree);
      refreshNodes(tree);
    } catch (error) {
      console.error("Error updating SegmentTree:", error);
    }
  };

  // Добавление элемента
  const handleAddElement = (newValue) => {
    if (newValue === "") return;
    const value = parseInt(newValue, 10);
    if (isNaN(value)) return;

    if (data.length >= MAX_LEAVES) {
      alert("Превышен лимит (16) листьев.");
      return null; // Indicate failure
    }
    const updatedData = [...data, value];
    setData(updatedData);
    updateTreeWithNewData(updatedData);
    return updatedData;
  };

  // Анимация перемещения узла
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

  // Анимация появления узла
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

  // Анимация исчезновения узла
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

  // Выделение пути от листа до корня
  const highlightPathFromLeaf = (leafNodeId) => {
    if (leafNodeId === undefined || !parentMap) return;

    let currentId = leafNodeId;
    let prevId = null;

    // Удаляем предыдущие выделения
    setNodes((old) => old.map((n) => ({ ...n, isHighlighted: false })));

    const pathIds = [];
    while (currentId !== undefined) {
      pathIds.push(currentId);
      const pId = parentMap[currentId];
      if (pId === undefined || pId === currentId) break;
      currentId = pId;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (prevId != null) {
        setNodes((old) =>
          old.map((node) =>
            node.id === prevId ? { ...node, isHighlighted: false } : node
          )
        );
      }
      if (i < pathIds.length) {
        const currentHighlightId = pathIds[i];
        setNodes((old) =>
          old.map((node) =>
            node.id === currentHighlightId
              ? { ...node, isHighlighted: true }
              : node
          )
        );
        prevId = currentHighlightId;
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (prevId !== null) {
            setNodes((old) =>
              old.map((node) =>
                node.id === prevId ? { ...node, isHighlighted: false } : node
              )
            );
          }
        }, 800);
      }
    }, 800);
  };

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
    isLoading, // Indicates if Wasm module is still loading
  };
};

export default UseSegmentTree;
