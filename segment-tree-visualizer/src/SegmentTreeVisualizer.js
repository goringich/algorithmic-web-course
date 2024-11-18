import React, { useState } from "react";
import SegmentTree from "./SegmentTree";

const SegmentTreeVisualizer = () => {
  const [nodes, setNodes] = useState([
    { id: 1, x: 400, y: 50, label: "0-7", range: [0, 7], value: 0, highlighted: false, children: [2, 3] },
    { id: 2, x: 300, y: 150, label: "0-3", range: [0, 3], value: 0, highlighted: false, children: [4, 5] },
    { id: 3, x: 500, y: 150, label: "4-7", range: [4, 7], value: 0, highlighted: false, children: [6, 7] },
    { id: 4, x: 250, y: 250, label: "0-1", range: [0, 1], value: 0, highlighted: false, children: [] },
    { id: 5, x: 350, y: 250, label: "2-3", range: [2, 3], value: 0, highlighted: false, children: [] },
    { id: 6, x: 450, y: 250, label: "4-5", range: [4, 5], value: 0, highlighted: false, children: [] },
    { id: 7, x: 550, y: 250, label: "6-7", range: [6, 7], value: 0, highlighted: false, children: [] },
  ]);

  const updateRange = (nodeId, start, end, valueToAdd) => {
    // Обновляет значения всех узлов, которые входят в диапазон
    const updateNodeValues = (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;
  
      const [nodeStart, nodeEnd] = node.range;
  
      // Если узел полностью входит в диапазон, обновляем значение
      if (start <= nodeStart && nodeEnd <= end) {
        node.value += valueToAdd;
        node.highlighted = true;
      }
  
      // Рекурсивное обновление дочерних узлов
      node.children.forEach((childId) => {
        updateNodeValues(childId);
      });
  
      // После обновления дочерних узлов, обновляем значение текущего узла
      if (node.children.length > 0) {
        node.value = node.children.reduce((sum, childId) => {
          const childNode = nodes.find((n) => n.id === childId);
          return sum + (childNode ? childNode.value : 0);
        }, 0);
      }
    };
  
    // Копируем массив узлов для создания нового состояния
    let updatedNodes = [...nodes];
  
    // Обновляем узлы в заданном диапазоне
    updateNodeValues(nodeId);
  
    // Обновляем состояние узлов
    setNodes(updatedNodes);
  
    // Снимаем выделение после небольшой задержки
    setTimeout(() => {
      updatedNodes = updatedNodes.map((node) => ({ ...node, highlighted: false }));
      setNodes(updatedNodes);
    }, 1000);
  };
  

  const handleAddRangeValue = () => {
    updateRange(1, 2, 3, 5);
  };

  return (
    <div>
      <h2>Segment Tree Visualizer</h2>
      <button onClick={handleAddRangeValue}>Add Value to Range [0-3]</button>
      <SegmentTree nodes={nodes} width={800} height={400} />
    </div>
  );
};

export default SegmentTreeVisualizer;
