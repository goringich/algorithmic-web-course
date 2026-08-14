import type { AlgorithmDefinition, AlgorithmStep, VisualEdge, VisualItem, VisualState } from "./types";

const treeItem = (
  id: string,
  label: string,
  x: number,
  y: number,
  state: VisualState = "idle",
  secondary?: string,
): VisualItem => ({ id, label, x, y, state, secondary });

const treeEdge = (
  from: string,
  to: string,
  id = `${from}-${to}`,
  state: VisualState = "idle",
): VisualEdge => ({ id, from, to, state });

const structureStep = (
  title: string,
  description: string,
  items: VisualItem[],
  edges: VisualEdge[] = [],
  metrics?: Record<string, string | number>,
): AlgorithmStep => ({ title, description, items, edges, metrics });

const linearItems = (values: number[], states: Record<number, VisualState> = {}): VisualItem[] =>
  values.map((value, index) => ({
    id: `n-${index}`,
    label: String(value),
    value,
    state: states[index] ?? "idle",
    secondary: String(index),
  }));

const stackAlgorithm: AlgorithmDefinition = {
  slug: "stack",
  title: "Стек",
  shortTitle: "Stack",
  category: "Структуры данных",
  difficulty: "starter",
  tier: "free",
  kind: "stack",
  summary: "LIFO-структура: последним пришёл — первым вышел.",
  intuition: "Доступна только вершина, поэтому push и pop не требуют поиска по коллекции.",
  complexity: { time: "O(1) push/pop", space: "O(n)", note: "Основа DFS, undo и стека вызовов." },
  pseudocode: ["push(x): append x", "pop(): remove last", "top(): read last"],
  tags: ["lifo", "container", "fundamentals"],
  lessonGoal: "Увидеть ограничение LIFO и понять, почему оно делает операции постоянными по времени.",
  buildSteps() {
    const ops: Array<["push" | "pop", number?]> = [["push", 4], ["push", 7], ["push", 2], ["pop"], ["push", 9]];
    const values: number[] = [];
    const steps: AlgorithmStep[] = [structureStep("Пустой стек", "Вершины пока нет.", [])];
    ops.forEach(([op, value]) => {
      if (op === "push") {
        values.push(value!);
        steps.push(structureStep("push", `Добавляем ${value} на вершину.`, linearItems(values, { [values.length - 1]: "success" }), [], { size: values.length }));
      } else {
        const removed = values.pop();
        steps.push(structureStep("pop", `Удаляем вершину ${removed}.`, linearItems(values, values.length ? { [values.length - 1]: "active" } : {}), [], { size: values.length }));
      }
    });
    return steps;
  },
};

const queueAlgorithm: AlgorithmDefinition = {
  slug: "queue",
  title: "Очередь",
  shortTitle: "Queue",
  category: "Структуры данных",
  difficulty: "starter",
  tier: "free",
  kind: "queue",
  summary: "FIFO-структура: первым пришёл — первым вышел.",
  intuition: "Добавление идёт в хвост, извлечение — из головы, поэтому порядок обслуживания сохраняется.",
  complexity: { time: "O(1) enqueue/dequeue", space: "O(n)", note: "Ключевая структура для BFS и систем очередей." },
  pseudocode: ["enqueue(x): append tail", "dequeue(): remove head", "front(): read head"],
  tags: ["fifo", "container", "fundamentals"],
  lessonGoal: "Связать FIFO-порядок с обходом графа по слоям и обработкой событий.",
  buildSteps() {
    const values: number[] = [];
    const steps: AlgorithmStep[] = [structureStep("Пустая очередь", "Голова и хвост не определены.", [])];
    [3, 8, 5, 1].forEach((value) => {
      values.push(value);
      steps.push(structureStep("enqueue", `${value} добавлен в хвост.`, linearItems(values, { [values.length - 1]: "success", 0: "active" }), [], { size: values.length }));
    });
    const removed = values.shift();
    steps.push(structureStep("dequeue", `${removed} покидает голову очереди.`, linearItems(values, values.length ? { 0: "active" } : {}), [], { size: values.length }));
    return steps;
  },
};

const linkedListAlgorithm: AlgorithmDefinition = {
  slug: "linked-list",
  title: "Связный список",
  shortTitle: "Linked List",
  category: "Структуры данных",
  difficulty: "starter",
  tier: "pro",
  kind: "list",
  summary: "Элементы хранят ссылки на следующий узел вместо соседства в памяти.",
  intuition: "Перенастроить несколько ссылок дешевле, чем сдвигать хвост массива.",
  complexity: { time: "O(1) insert/delete with node, O(n) search", space: "O(n)", note: "Цена гибкости — отсутствие случайного доступа." },
  pseudocode: ["new.next = prev.next", "prev.next = new", "delete: prev.next = victim.next"],
  tags: ["nodes", "pointers", "container"],
  lessonGoal: "Понять разницу между стоимостью доступа и стоимостью структурных изменений.",
  buildSteps() {
    const snapshot = (values: number[], active = -1, success = -1): AlgorithmStep => {
      const nodes = values.map((value, index) => treeItem(`n-${index}`, String(value), 12 + index * 22, 50, index === success ? "success" : index === active ? "active" : "idle", index === 0 ? "head" : undefined));
      const edges = values.slice(1).map((_, index) => ({ ...treeEdge(`n-${index}`, `n-${index + 1}`), directed: true }));
      return structureStep("Состояние списка", "Каждый узел знает только следующий.", nodes, edges, { length: values.length });
    };
    const steps = [snapshot([2, 5, 8])];
    const inserted = [2, 5, 6, 8];
    steps.push({ ...snapshot(inserted, 2, 2), title: "Вставка 6", description: "Меняем две ссылки — хвост массива сдвигать не нужно." });
    const deleted = [2, 6, 8];
    steps.push({ ...snapshot(deleted, 1, 1), title: "Удаление 5", description: "Предыдущий узел теперь ссылается сразу на 6." });
    return steps;
  },
};

const heapAlgorithm: AlgorithmDefinition = {
  slug: "binary-heap",
  title: "Двоичная куча",
  shortTitle: "Binary Heap",
  category: "Деревья",
  difficulty: "core",
  tier: "pro",
  kind: "tree",
  summary: "Полное двоичное дерево, где родитель не больше детей в min-heap.",
  intuition: "Форма дерева кодируется индексами массива: parent=(i-1)/2, children=2i+1 и 2i+2.",
  complexity: { time: "O(log n) insert/extract, O(1) min", space: "O(n)", note: "База priority queue и многих жадных алгоритмов." },
  pseudocode: ["append x", "while x < parent", "  swap x and parent", "extract: move last to root and sift down"],
  tags: ["heap", "priority-queue", "tree"],
  lessonGoal: "Увидеть, как локальный инвариант по рёбрам обеспечивает быстрый доступ к глобальному минимуму.",
  buildSteps() {
    const values: number[] = [];
    const steps: AlgorithmStep[] = [];
    const render = (active = -1, success = -1, title = "Куча", description = "") => {
      const nodes = values.map((value, index) => {
        const level = Math.floor(Math.log2(index + 1));
        const first = 2 ** level - 1;
        const pos = index - first;
        const count = 2 ** level;
        const x = ((pos + 1) / (count + 1)) * 100;
        return treeItem(`h-${index}`, String(value), x, 18 + level * 25, index === success ? "success" : index === active ? "active" : "idle", `i=${index}`);
      });
      const edges = values.slice(1).map((_, index) => treeEdge(`h-${Math.floor(index / 2)}`, `h-${index + 1}`));
      steps.push(structureStep(title, description, nodes, edges, { size: values.length }));
    };
    [7, 3, 9, 1, 5, 2].forEach((value) => {
      values.push(value);
      let index = values.length - 1;
      render(index, -1, "Вставка", `${value} сначала попадает в конец.`);
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (values[parent] <= values[index]) break;
        [values[parent], values[index]] = [values[index], values[parent]];
        index = parent;
        render(index, index, "Подъём", "Нарушение min-heap исправлено обменом с родителем.");
      }
    });
    return steps;
  },
};

type BstNode = { id: string; value: number; left?: BstNode; right?: BstNode };

const layoutBst = (root: BstNode | undefined) => {
  const nodes: VisualItem[] = [];
  const edges: VisualEdge[] = [];
  const visit = (node: BstNode | undefined, minX: number, maxX: number, depth: number) => {
    if (!node) return;
    const x = (minX + maxX) / 2;
    nodes.push(treeItem(node.id, String(node.value), x, 16 + depth * 24));
    if (node.left) edges.push(treeEdge(node.id, node.left.id));
    if (node.right) edges.push(treeEdge(node.id, node.right.id));
    visit(node.left, minX, x, depth + 1);
    visit(node.right, x, maxX, depth + 1);
  };
  visit(root, 4, 96, 0);
  return { nodes, edges };
};

const bstAlgorithm: AlgorithmDefinition = {
  slug: "binary-search-tree",
  title: "Бинарное дерево поиска",
  shortTitle: "BST",
  category: "Деревья",
  difficulty: "core",
  tier: "pro",
  kind: "tree",
  summary: "Слева значения меньше узла, справа — больше.",
  intuition: "Каждое сравнение выбирает целое поддерево и отбрасывает второе.",
  complexity: { time: "O(h), average O(log n)", space: "O(n)", note: "Без балансировки высота может стать O(n)." },
  pseudocode: ["start at root", "if x < node: go left", "if x > node: go right", "insert at empty child"],
  tags: ["bst", "search", "tree"],
  lessonGoal: "Связать эффективность поиска не с числом узлов, а с высотой дерева.",
  buildSteps() {
    let root: BstNode | undefined;
    let nextId = 0;
    const steps: AlgorithmStep[] = [];
    for (const value of [8, 3, 10, 1, 6, 14, 4, 7, 13]) {
      const node: BstNode = { id: `b-${nextId++}`, value };
      if (!root) root = node;
      else {
        let current = root;
        while (true) {
          if (value < current.value) {
            if (!current.left) { current.left = node; break; }
            current = current.left;
          } else {
            if (!current.right) { current.right = node; break; }
            current = current.right;
          }
        }
      }
      const { nodes, edges } = layoutBst(root);
      const highlighted = nodes.map((item) => item.id === node.id ? { ...item, state: "success" as const } : item);
      steps.push(structureStep("Вставка", `${value} занимает позицию, найденную последовательностью сравнений.`, highlighted, edges, { nodes: nodes.length }));
    }
    return steps;
  },
};

const segmentTreeAlgorithm: AlgorithmDefinition = {
  slug: "segment-tree",
  title: "Дерево отрезков",
  shortTitle: "Segment Tree",
  category: "Деревья",
  difficulty: "advanced",
  tier: "pro",
  kind: "tree",
  summary: "Иерархически хранит агрегаты по диапазонам и отвечает на запросы за O(log n).",
  intuition: "Любой диапазон раскладывается на небольшое число уже посчитанных узлов дерева.",
  complexity: { time: "O(n) build, O(log n) query/update", space: "O(n)", note: "Поддерживает суммы, min/max и ленивые обновления." },
  pseudocode: ["node stores aggregate of [l,r)", "split at mid", "build children", "query only intersecting nodes"],
  tags: ["range-query", "tree", "competitive-programming"],
  lessonGoal: "Увидеть декомпозицию диапазона на логарифмическое число канонических сегментов.",
  buildSteps() {
    const source = [5, 2, 7, 1, 3, 6];
    const nodes: VisualItem[] = [];
    const edges: VisualEdge[] = [];
    const build = (left: number, right: number, x1: number, x2: number, depth: number, parent?: string): { id: string; sum: number } => {
      const id = `s-${left}-${right}`;
      let sum: number;
      if (right - left === 1) sum = source[left];
      else {
        const mid = Math.floor((left + right) / 2);
        const leftNode = build(left, mid, x1, (x1 + x2) / 2, depth + 1, id);
        const rightNode = build(mid, right, (x1 + x2) / 2, x2, depth + 1, id);
        sum = leftNode.sum + rightNode.sum;
      }
      nodes.push(treeItem(id, String(sum), (x1 + x2) / 2, 13 + depth * 23, "idle", `[${left},${right})`));
      if (parent) edges.push(treeEdge(parent, id));
      return { id, sum };
    };
    build(0, source.length, 3, 97, 0);
    const ordered = [...nodes].sort((a, b) => (b.y ?? 0) - (a.y ?? 0));
    const steps: AlgorithmStep[] = [structureStep("Исходный массив", `Данные: ${source.join(", ")}. Листья хранят отдельные элементы.`, nodes.map((n) => ({ ...n, state: "muted" })), edges)];
    const ready = new Set<string>();
    ordered.forEach((node) => {
      ready.add(node.id);
      steps.push(structureStep("Строим агрегат", `${node.secondary}: сумма = ${node.label}.`, nodes.map((n) => ({ ...n, state: ready.has(n.id) ? (n.id === node.id ? "success" : "visited") : "muted" })), edges, { built: ready.size }));
    });
    const queryIds = new Set(["s-1-3", "s-3-4", "s-4-6"]);
    steps.push(structureStep("Запрос [1, 6)", "Диапазон покрывается несколькими уже посчитанными узлами — пересчитывать элементы не нужно.", nodes.map((n) => ({ ...n, state: queryIds.has(n.id) ? "active" : "muted" })), edges));
    return steps;
  },
};

const fenwickAlgorithm: AlgorithmDefinition = {
  slug: "fenwick-tree",
  title: "Дерево Фенвика",
  shortTitle: "Fenwick Tree",
  category: "Деревья",
  difficulty: "advanced",
  tier: "pro",
  kind: "array",
  summary: "Компактно хранит частичные префиксные суммы и обновляет их через младший установленный бит.",
  intuition: "Индекс кодирует длину блока, за который отвечает ячейка BIT.",
  complexity: { time: "O(log n) update/query", space: "O(n)", note: "Проще segment tree для обратимых префиксных агрегатов." },
  pseudocode: ["update(i,delta): i += lowbit(i)", "prefix(i): i -= lowbit(i)", "lowbit(i) = i & -i"],
  tags: ["range-query", "bit", "prefix"],
  lessonGoal: "Связать двоичное представление индекса с логарифмическим прыжком по блокам.",
  buildSteps() {
    const source = [3, 2, 5, 1, 4, 6, 2, 7];
    const bit = Array(source.length + 1).fill(0) as number[];
    const steps: AlgorithmStep[] = [];
    source.forEach((value, zeroIndex) => {
      let index = zeroIndex + 1;
      while (index < bit.length) {
        bit[index] += value;
        steps.push({
          title: "update",
          description: `Добавляем ${value} в BIT[${index}], затем прыгаем на i + lowbit(i).`,
          items: linearItems(bit.slice(1), { [index - 1]: "success" }),
          metrics: { sourceIndex: zeroIndex, bitIndex: index, lowbit: index & -index },
        });
        index += index & -index;
      }
    });
    let index = 7;
    let sum = 0;
    while (index > 0) {
      sum += bit[index];
      steps.push({
        title: "prefix query",
        description: `Берём BIT[${index}] и прыгаем на i - lowbit(i). Текущая сумма ${sum}.`,
        items: linearItems(bit.slice(1), { [index - 1]: "active" }),
        metrics: { bitIndex: index, sum },
      });
      index -= index & -index;
    }
    return steps;
  },
};

const unionFindAlgorithm: AlgorithmDefinition = {
  slug: "union-find",
  title: "Система непересекающихся множеств",
  shortTitle: "Union-Find",
  category: "Структуры данных",
  difficulty: "advanced",
  tier: "pro",
  kind: "graph",
  summary: "Поддерживает компоненты связности с операциями find и union почти за O(1) амортизированно.",
  intuition: "Сжатие путей делает повторные поиски корня всё дешевле, а union by rank не даёт деревьям расти.",
  complexity: { time: "O(α(n)) amortized", space: "O(n)", note: "α(n) практически постоянна для реальных размеров." },
  pseudocode: ["find(x): compress path to root", "union(a,b): attach smaller rank root", "same(a,b): find(a)==find(b)"],
  tags: ["dsu", "components", "kruskal"],
  lessonGoal: "Понять амортизацию на примере структуры, которая ускоряет сама себя.",
  buildSteps() {
    const parent = [0, 1, 2, 3, 4, 5];
    const rank = Array(6).fill(0) as number[];
    const coords = [[10, 30], [26, 65], [42, 30], [58, 65], [74, 30], [90, 65]];
    const find = (x: number): number => {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    };
    const render = (title: string, description: string, active: number[] = []): AlgorithmStep => {
      const nodes = parent.map((_, index) => treeItem(`u-${index}`, String(index), coords[index][0], coords[index][1], active.includes(index) ? "success" : "idle", `root ${find(index)}`));
      const edges = parent.flatMap((p, index) => p === index ? [] : [treeEdge(`u-${index}`, `u-${p}`, `u-${index}-${p}`, "visited")]);
      return structureStep(title, description, nodes, edges, { components: new Set(parent.map((_, i) => find(i))).size });
    };
    const steps = [render("Старт", "Каждый элемент — отдельная компонента.")];
    const unite = (a: number, b: number) => {
      let ra = find(a);
      let rb = find(b);
      if (ra === rb) return;
      if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
      parent[rb] = ra;
      if (rank[ra] === rank[rb]) rank[ra] += 1;
      steps.push(render("union", `Объединяем ${a} и ${b}: корень ${rb} подвешен к ${ra}.`, [a, b, ra]));
    };
    unite(0, 1);
    unite(2, 3);
    unite(4, 5);
    unite(1, 2);
    find(3);
    steps.push(render("path compression", "После find(3) путь к корню сокращён для последующих запросов.", [3, find(3)]));
    return steps;
  },
};

export const structureAlgorithms: AlgorithmDefinition[] = [
  stackAlgorithm,
  queueAlgorithm,
  linkedListAlgorithm,
  heapAlgorithm,
  bstAlgorithm,
  segmentTreeAlgorithm,
  fenwickAlgorithm,
  unionFindAlgorithm,
];
