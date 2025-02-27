import createSegmentTreeModule from "../../assets/JS_complied_algorithms/segment_tree.mjs";
import { VisNode } from "../types/VisNode";

export default class SegmentTreeWasm {
  private array: number[];
  private modulePromise: Promise<any>;

  constructor(array: number[]) {
    if (!Array.isArray(array) || !array.every((x) => typeof x === "number")) {
      throw new Error("Ошибка: передан некорректный массив чисел в SegmentTreeWasm.");
    }
    this.array = array.slice();
    this.modulePromise = createSegmentTreeModule().then((module: any) => {
      const vectorInt = new module.VectorInt();
      this.array.forEach((val) => vectorInt.push_back(val));
      module.setArray(vectorInt);

      if (typeof module.buildTree === "function") {
        module.buildTree(0, 0, this.array.length - 1);
      }

      vectorInt.delete();
      return module;
    });
  }

  async setData(newData: number[]): Promise<void> {
    const module = await this.modulePromise;
    const vectorInt = new module.VectorInt();
    newData.forEach((val) => vectorInt.push_back(val));
    module.setArray(vectorInt);

    if (typeof module.buildTree === "function") {
      module.buildTree(0, 0, newData.length - 1);
      console.log("Дерево перестроено с новыми данными.");
    }
    vectorInt.delete();
    this.array = newData.slice();
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

  async getTreeForVisualization(): Promise<VisNode[]> {
    const module = await this.modulePromise;
    const rawTreeVector = module.getTree();
    if (
      !rawTreeVector ||
      typeof rawTreeVector.size !== "function" ||
      typeof rawTreeVector.get !== "function"
    ) {
      console.error("Ошибка: getTree() вернул неподдерживаемый формат", rawTreeVector);
      return [];
    }

    const rawTree: number[] = [];
    for (let i = 0; i < rawTreeVector.size(); i++) {
      rawTree.push(rawTreeVector.get(i));
    }

    const nodes: VisNode[] = [];

    const buildVisualization = (
      node: number,
      start: number,
      end: number,
      x: number,
      y: number,
      spacingX: number,
      spacingY: number,
      parentId: number
    ): number => {
      const id = node;
      const value = rawTree[node];
      const currentNode: VisNode = {
        id,
        x,
        y,
        value,
        label: start === end ? `Index ${start}` : `${start}-${end}`,
        range: [start, end],
        children: [],
        parentId,
      };

      if (start === end) {
        nodes.push(currentNode);
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
        spacingY,
        id
      );
      const rightChildId = buildVisualization(
        rightChild,
        mid + 1,
        end,
        x + spacingX / 2,
        y + spacingY,
        spacingX / 2,
        spacingY,
        id
      );

      currentNode.children = [leftChildId, rightChildId];
      nodes.push(currentNode);
      return id;
    };

    if (this.array.length > 0) {
      buildVisualization(0, 0, this.array.length - 1, 400, 50, 300, 100, -1);
    }

    return nodes;
  }
}
