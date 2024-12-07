export class SegmentTree {
  constructor(array) {
    this.array = array;
    this.tree = new Array(4 * array.length).fill(0); // Дерево отрезков
    this.build(0, 0, array.length - 1); // Строим дерево
  }

  build(node, start, end) {
    if (start === end) {
      // Листовой узел
      this.tree[node] = this.array[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      const leftChild = 2 * node + 1;
      const rightChild = 2 * node + 2;

      // Рекурсивное построение
      this.build(leftChild, start, mid);
      this.build(rightChild, mid + 1, end);

      // Значение текущего узла - сумма дочерних
      this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
    }
  }

  // Остальные методы остаются без изменений...
  update(index, value, node = 0, start = 0, end = this.array.length - 1) {
    if (start === end) {
      this.tree[node] += value;
      this.array[index] += value;
    } else {
      const mid = Math.floor((start + end) / 2);
      const leftChild = 2 * node + 1;
      const rightChild = 2 * node + 2;

      if (index <= mid) {
        this.update(index, value, leftChild, start, mid);
      } else {
        this.update(index, value, rightChild, mid + 1, end);
      }

      this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
    }
  }

  getTreeForVisualization() {
    const nodes = [];
    const idCounter = { current: 0 };

    const buildVisualization = (node, start, end, x, y, spacingX, spacingY) => {
      const id = idCounter.current++;
      const nodeData = {
        id,
        x,
        y,
        value: this.tree[node],
        label: start === end ? `Index ${start}` : `${start}-${end}`,
        range: [start, end],
        children: [],
      };

      if (start === end) {
        nodes.push(nodeData);
        return id;
      }

      const mid = Math.floor((start + end) / 2);
      const leftChild = 2 * node + 1;
      const rightChild = 2 * node + 2;

      const leftChildId = buildVisualization(leftChild, start, mid, x - spacingX / 2, y + spacingY, spacingX / 2, spacingY);
      const rightChildId = buildVisualization(rightChild, mid + 1, end, x + spacingX / 2, y + spacingY, spacingX / 2, spacingY);

      nodeData.children = [leftChildId, rightChildId];
      nodes.push(nodeData);

      return id;
    };

    buildVisualization(0, 0, this.array.length - 1, 400, 50, 300, 100);
    return nodes;
  }
}
