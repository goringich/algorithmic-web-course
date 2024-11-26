import React, { useState } from "react";
import SegmentTree from "./SegmentTree";
import "./App.css";

class SegmentTree {
  constructor(array){
    this.array = array;
    this.tree = [];
    this.build();
  }

  build (node, start, end){
    if (!this.tree[node]) 

    
  }

};

const SegmentTreeVisualizer = () => {
  const [array] = useState([5, 8, 6, 3, 2, 7, 2, 6]); // Элементы массива
  const [nodes, setNodes] = useState(buildSegmentTree(array));
  const [arrayIndex, setArrayIndex] = useState(0);
  const [value, setValue] = useState(0);

  // Функция для построения дерева отрезков
  function buildSegmentTree(array) {
    const nodes = [];
    let idCounter = 1;

    // Рекурсивное построение дерева
    function buildTree(start, end, x, y) {
      const nodeId = idCounter++;
      if (start === end) {
        // Листовой узел (элемент массива)
        nodes.push({
          id: nodeId,
          x,
          y,
          label: `Index ${start}`,
          range: [start, end],
          value: array[start],
          children: [],
        });
        return nodeId;
      }

      const mid = Math.floor((start + end) / 2);
      const childXOffset = 50 * (end - start); // Расстояние между дочерними узлами
      const leftChildId = buildTree(start, mid, x - childXOffset, y + 100);
      const rightChildId = buildTree(mid + 1, end, x + childXOffset, y + 100);

      // Узел диапазона
      nodes.push({
        id: nodeId,
        x,
        y,
        label: `${start}-${end}`,
        range: [start, end],
        value: nodes.find((n) => n.id === leftChildId).value + nodes.find((n) => n.id === rightChildId).value,
        children: [leftChildId, rightChildId],
      });

      return nodeId;
    }

    buildTree(0, array.length - 1, 800, 50); // Центрирование дерева
    return nodes;
  }

  return (
    <div className="tree-container">
      <h2 className="title">Segment Tree Visualizer</h2>
      <SegmentTree nodes={nodes} width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
};

export default SegmentTreeVisualizer;
