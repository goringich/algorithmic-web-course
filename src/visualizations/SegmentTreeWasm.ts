// SegmentTreeWasm.ts
// Путь уточни под себя
import createSegmentTreeModule from "../assets/JS_complied_algorithms/segment_tree.mjs";

interface SegmentTreeNodeData {
  id: number;
  x: number;
  y: number;
  value: number;
  label: string;
  range: [number, number];
  children: number[];
}

export default class SegmentTreeWasm {
  private array: number[];
  private modulePromise: Promise<any>;

  constructor(array: number[]) {
    if (!Array.isArray(array) || !array.every((x) => typeof x === "number")) {
      throw new Error("Ошибка: передан некорректный массив чисел в SegmentTreeWasm.");
    }
    this.array = array.slice();
    console.log("Перед передачей в setArray:", this.array);
    console.log("Тип данных:", typeof this.array);
    this.modulePromise = createSegmentTreeModule().then((module: any) => {
      const vectorInt = new module.VectorInt();
      
      // Явно заполняем его значениями
      this.array.forEach((val) => vectorInt.push_back(val));
    
      // Передаём в C++
      module.setArray(vectorInt);
      
      // Очищаем вручную (иначе утечка памяти)
      vectorInt.delete();
      
      return module;
    });
    
  }
  

  async update(index: number, value: number): Promise<void> {
    const module = await this.modulePromise;
    module.updateTree(0, 0, this.array.length - 1, index, value);
    this.array[index] += value;
  }

  async query(l: number, r: number): Promise<number> {
    const module = await this.modulePromise;
    return module.queryTree(0, 0, this.array.length - 1, l, r);
  }

  async getTreeForVisualization(): Promise<SegmentTreeNodeData[]> {
    const module = await this.modulePromise;
    const rawTree: number[] = module.getTree();

    const nodes: SegmentTreeNodeData[] = [];
    const idCounter = { current: 0 };

    const buildVisualization = (
      node: number,
      start: number,
      end: number,
      x: number,
      y: number,
      spacingX: number,
      spacingY: number
    ): number => {
      const id = idCounter.current++;
      const value = rawTree[node];
      const nodeData: SegmentTreeNodeData = {
        id,
        x,
        y,
        value,
        label: start === end ? `Index ${start}` : `${start}-${end}`,
        range: [start, end],
        children: []
      };

      if (start === end) {
        nodes.push(nodeData);
        return id;
      }

      const mid = Math.floor((start + end) / 2);
      const leftChild = 2 * node + 1;
      const rightChild = 2 * node + 2;

      const leftChildId = buildVisualization(
        leftChild,
        start,
        mid,
        x - spacingX / 2,
        y + spacingY,
        spacingX / 2,
        spacingY
      );
      const rightChildId = buildVisualization(
        rightChild,
        mid + 1,
        end,
        x + spacingX / 2,
        y + spacingY,
        spacingX / 2,
        spacingY
      );

      nodeData.children = [leftChildId, rightChildId];
      nodes.push(nodeData);
      return id;
    };

    buildVisualization(0, 0, this.array.length - 1, 400, 50, 300, 100);
    return nodes;
  }
}
