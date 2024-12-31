// Пример SegmentTree с добавленным методом updateAndReturnPath
export class SegmentTree {
  constructor(data) {
    this.n = data.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.data = data; // Сохраняем исходные данные
    this._build(0, 0, this.n - 1); // Построение дерева
  }

  // Строим дерево (рекурсивно)
  _build(index, start, end) {
    if (start === end) {
      this.tree[index] = this.data[start];
      return;
    }
    const mid = Math.floor((start + end) / 2);
    this._build(index * 2 + 1, start, mid);
    this._build(index * 2 + 2, mid + 1, end);
    this.tree[index] = this.tree[index * 2 + 1] + this.tree[index * 2 + 2];
  }

  // Вспомогательный метод для обновления (без возврата пути)
  update(pos, value) {
    this._updateUtil(0, 0, this.n - 1, pos, value);
  }

  _updateUtil(index, start, end, pos, value) {
    if (start === end) {
      this.tree[index] = value;
      return;
    }
    const mid = Math.floor((start + end) / 2);
    if (pos <= mid) {
      this._updateUtil(index * 2 + 1, start, mid, pos, value);
    } else {
      this._updateUtil(index * 2 + 2, mid + 1, end, pos, value);
    }
    this.tree[index] = this.tree[index * 2 + 1] + this.tree[index * 2 + 2];
  }

  // Новая версия обновления, возвращающая путь (массив диапазонов)
  updateAndReturnPath(pos, value) {
    const pathRanges = []; // массив пар [start, end] от листа к корню
    const updateUtilWithPath = (index, start, end, pos, value) => {
      // Добавляем в путь текущий узел
      pathRanges.push([start, end]);

      if (start === end && start === pos) {
        // Лист
        this.tree[index] = value;
        return;
      }

      const mid = Math.floor((start + end) / 2);
      if (pos <= mid) {
        updateUtilWithPath(index * 2 + 1, start, mid, pos, value);
      } else {
        updateUtilWithPath(index * 2 + 2, mid + 1, end, pos, value);
      }
      // После рекурсивного обновления пересчитываем значение
      this.tree[index] = this.tree[index * 2 + 1] + this.tree[index * 2 + 2];
    };

    updateUtilWithPath(0, 0, this.n - 1, pos, value);
    return pathRanges;
  }

  // Метод для получения узлов в удобном для нас формате (x,y,label,value,range,children)
  getTreeForVisualization() {
    const result = [];
    // Мы используем BFS или DFS, чтобы получить дерево в виде массива узлов
    const queue = [{ index: 0, start: 0, end: this.n - 1, depth: 0, x: 0, y: 0 }];
    const levels = {}; // запоминаем максимальное кол-во узлов на каждом уровне, чтобы рассчитать позиционирование

    while (queue.length > 0) {
      const node = queue.shift();
      const { index, start, end, depth } = node;

      // Параметры для визуализации
      if (!levels[depth]) levels[depth] = 0;
      const currentNode = {
        id: `${index}-${start}-${end}`, // уникальный id
        range: [start, end],
        value: this.tree[index],
        label: `${start === end ? "Leaf" : "Node"} [${start}, ${end}]`,
        // x,y заполним позже (после подсчёта уровня и позиции)
        x: 0,
        y: 0,
        children: []
      };
      result.push(currentNode);

      // Добавляем детей, если это не лист
      if (start < end) {
        const mid = Math.floor((start + end) / 2);
        queue.push({
          index: index * 2 + 1,
          start,
          end: mid,
          depth: depth + 1
        });
        queue.push({
          index: index * 2 + 2,
          start: mid + 1,
          end,
          depth: depth + 1
        });
      }
      levels[depth] += 1;
    }

    // Заново пройдёмся, чтобы связать узлы родителя и детей
    for (let i = 0; i < result.length; i++) {
      const node = result[i];
      const { range, id } = node;
      // Ищем детей, у которых родитель - это node
      const leftId = `${2 * parseInt(id.split("-")[0], 10) + 1}-${range[0]}-${Math.floor((range[0] + range[1]) / 2)}`;
      const rightId = `${2 * parseInt(id.split("-")[0], 10) + 2}-${Math.floor((range[0] + range[1]) / 2) + 1}-${range[1]}`;

      const leftChild = result.find((el) => el.id === leftId);
      const rightChild = result.find((el) => el.id === rightId);

      if (leftChild) node.children.push(leftChild.id);
      if (rightChild) node.children.push(rightChild.id);
    }

    // Определяем координаты (x,y) для каждого уровня
    // Чтобы дерево выглядело красиво и относительно минималистично
    // возьмём ширину = 800px и высоту = (кол-во уровней * 100 + запас)
    // но позже при визуализации мы переопределим через анимацию
    const depthMap = {};
    result.forEach((node) => {
      const nodeDepth = node.id.split("-")[0].split("").reduce((acc, digit) => {
        // не самое точное, но для простоты
        return acc + (digit === "0" ? 0 : 1);
      }, 0);
      // или можно взять реальные depth из BFS - это точнее
      // но для примера пусть так
      // Узнаём depth из id, упрощённо
      // Гораздо лучше хранить depth прямо при BFS
      // Для упрощения — используем node.range
      const [start, end] = node.range;
      // В массиве queue он лежал как depth, можно добавить и туда
      // Ниже используем жёстко: если start===end -> Leaf
      // В реальном проекте лучше аккуратно хранить depth
      // Здесь чисто демонстрационный пример.
    });

    // Используем BFS-указанный depth
    // Для корректных координат нужно сделать ещё один обход
    const layered = {};
    const queue2 = [{ node: result[0], depth: 0 }];
    while (queue2.length > 0) {
      const { node, depth } = queue2.shift();
      if (!layered[depth]) {
        layered[depth] = [];
      }
      layered[depth].push(node);

      node.children.forEach((childId) => {
        const childNode = result.find((el) => el.id === childId);
        queue2.push({ node: childNode, depth: depth + 1 });
      });
    }

    // Распределяем по уровням
    const maxDepth = Object.keys(layered).length - 1;
    const baseY = 60; // начальная позиция по высоте
    const verticalGap = 100; // расстояние между уровнями
    for (let d = 0; d <= maxDepth; d++) {
      const levelNodes = layered[d];
      const count = levelNodes.length;
      // Расположим их равномерно по ширине: от 100 до 700 (пример)
      const stepX = 600 / (count + 1);
      for (let i = 0; i < levelNodes.length; i++) {
        const xPos = 100 + stepX * (i + 1);
        const yPos = baseY + d * verticalGap;
        levelNodes[i].x = xPos;
        levelNodes[i].y = yPos;
      }
    }

    return result;
  }
}
