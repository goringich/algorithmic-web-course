import type { AlgorithmDefinition, AlgorithmStep, VisualEdge, VisualItem, VisualState } from "./types";

const baseNodes: VisualItem[] = [
  { id: "A", label: "A", x: 10, y: 48 },
  { id: "B", label: "B", x: 30, y: 18 },
  { id: "C", label: "C", x: 30, y: 78 },
  { id: "D", label: "D", x: 55, y: 24 },
  { id: "E", label: "E", x: 55, y: 72 },
  { id: "F", label: "F", x: 82, y: 48 },
];

const weightedEdges: VisualEdge[] = [
  { id: "AB", from: "A", to: "B", weight: 4 },
  { id: "AC", from: "A", to: "C", weight: 2 },
  { id: "BC", from: "B", to: "C", weight: 1 },
  { id: "BD", from: "B", to: "D", weight: 5 },
  { id: "CD", from: "C", to: "D", weight: 8 },
  { id: "CE", from: "C", to: "E", weight: 10 },
  { id: "DE", from: "D", to: "E", weight: 2 },
  { id: "DF", from: "D", to: "F", weight: 6 },
  { id: "EF", from: "E", to: "F", weight: 3 },
];

const graphStep = (
  title: string,
  description: string,
  states: Record<string, VisualState> = {},
  edgeStates: Record<string, VisualState> = {},
  metrics?: Record<string, string | number>,
  edges: VisualEdge[] = weightedEdges,
): AlgorithmStep => ({
  title,
  description,
  items: baseNodes.map((node) => ({ ...node, state: states[node.id] ?? "idle" })),
  edges: edges.map((edge) => ({ ...edge, state: edgeStates[edge.id] ?? "idle" })),
  metrics,
});

const adjacency = (edges: VisualEdge[]) => {
  const map = new Map<string, Array<{ node: string; edge: VisualEdge }>>();
  baseNodes.forEach((node) => map.set(node.id, []));
  edges.forEach((edge) => {
    map.get(edge.from)!.push({ node: edge.to, edge });
    if (!edge.directed) map.get(edge.to)!.push({ node: edge.from, edge });
  });
  return map;
};

const bfs: AlgorithmDefinition = {
  slug: "bfs",
  title: "Обход в ширину",
  shortTitle: "BFS",
  category: "Графы",
  difficulty: "core",
  tier: "free",
  kind: "graph",
  summary: "Посещает вершины слоями по расстоянию в рёбрах от старта.",
  intuition: "Очередь гарантирует, что сначала обрабатываются все вершины текущего расстояния.",
  complexity: { time: "O(V+E)", space: "O(V)", note: "Даёт кратчайшие пути в невзвешенном графе." },
  pseudocode: ["queue = [start]", "mark start", "while queue", "  v = pop front", "  enqueue unseen neighbors"],
  tags: ["graph", "queue", "shortest-path"],
  lessonGoal: "Связать FIFO-очередь с гарантией обработки графа по слоям.",
  buildSteps() {
    const adj = adjacency(weightedEdges);
    const seen = new Set<string>(["A"]);
    const queue = ["A"];
    const steps = [graphStep("Старт", "A помещена в очередь.", { A: "frontier" }, {}, { queue: "A" })];
    while (queue.length) {
      const current = queue.shift()!;
      const state: Record<string, VisualState> = {};
      seen.forEach((id) => { state[id] = "visited"; });
      state[current] = "active";
      steps.push(graphStep("Извлекаем вершину", `Обрабатываем ${current}.`, state, {}, { queue: queue.join(" → ") || "∅" }));
      for (const { node, edge } of adj.get(current) ?? []) {
        if (seen.has(node)) continue;
        seen.add(node);
        queue.push(node);
        state[node] = "frontier";
        steps.push(graphStep("Открыта новая вершина", `${node} впервые достижима из ${current}.`, state, { [edge.id]: "success" }, { queue: queue.join(" → ") }));
      }
    }
    return steps;
  },
};

const dfs: AlgorithmDefinition = {
  slug: "dfs",
  title: "Обход в глубину",
  shortTitle: "DFS",
  category: "Графы",
  difficulty: "core",
  tier: "pro",
  kind: "graph",
  summary: "Уходит по одному пути максимально глубоко, затем откатывается.",
  intuition: "Стек хранит незавершённые точки возврата и превращает рекурсию в явную структуру.",
  complexity: { time: "O(V+E)", space: "O(V)", note: "Используется для компонент, циклов, топологической сортировки." },
  pseudocode: ["push start", "while stack", "  v = pop", "  if unseen: visit", "  push neighbors"],
  tags: ["graph", "stack", "traversal"],
  lessonGoal: "Понять, как LIFO-порядок создаёт глубокий маршрут и естественный backtracking.",
  buildSteps() {
    const adj = adjacency(weightedEdges);
    const seen = new Set<string>();
    const stack = ["A"];
    const steps: AlgorithmStep[] = [];
    while (stack.length) {
      const current = stack.pop()!;
      if (seen.has(current)) continue;
      seen.add(current);
      const states: Record<string, VisualState> = {};
      seen.forEach((id) => { states[id] = "visited"; });
      states[current] = "active";
      steps.push(graphStep("Погружаемся", `Посещаем ${current}. Стек: ${stack.join(" → ") || "∅"}.`, states, {}, { visited: seen.size }));
      const neighbors = [...(adj.get(current) ?? [])].reverse();
      neighbors.forEach(({ node }) => { if (!seen.has(node)) stack.push(node); });
    }
    return steps;
  },
};

const dijkstra: AlgorithmDefinition = {
  slug: "dijkstra",
  title: "Алгоритм Дейкстры",
  shortTitle: "Dijkstra",
  category: "Графы",
  difficulty: "advanced",
  tier: "pro",
  kind: "graph",
  summary: "Находит кратчайшие пути от одной вершины при неотрицательных весах.",
  intuition: "Минимальная ещё не зафиксированная дистанция уже не может улучшиться через более далёкую вершину.",
  complexity: { time: "O((V+E) log V)", space: "O(V)", note: "С бинарной кучей; отрицательные веса запрещены." },
  pseudocode: ["dist[start]=0", "repeat nearest unvisited", "  fix its distance", "  relax outgoing edges"],
  tags: ["graph", "shortest-path", "priority-queue"],
  lessonGoal: "Увидеть доказательную роль неотрицательных весов в жадной фиксации вершины.",
  buildSteps() {
    const adj = adjacency(weightedEdges);
    const dist: Record<string, number> = Object.fromEntries(baseNodes.map((n) => [n.id, Number.POSITIVE_INFINITY]));
    dist.A = 0;
    const fixed = new Set<string>();
    const steps = [graphStep("Старт", "dist[A] = 0, остальные расстояния бесконечны.", { A: "frontier" }, {}, { "d(A)": 0 })];
    while (fixed.size < baseNodes.length) {
      const current = baseNodes.map((n) => n.id).filter((id) => !fixed.has(id)).sort((a, b) => dist[a] - dist[b])[0];
      if (!current || !Number.isFinite(dist[current])) break;
      fixed.add(current);
      const states: Record<string, VisualState> = {};
      fixed.forEach((id) => { states[id] = "visited"; });
      states[current] = "success";
      steps.push(graphStep("Фиксируем вершину", `${current}: кратчайшее расстояние ${dist[current]}.`, states, {}, { distance: dist[current] }));
      for (const { node, edge } of adj.get(current) ?? []) {
        if (fixed.has(node)) continue;
        const candidate = dist[current] + (edge.weight ?? 1);
        if (candidate < dist[node]) {
          dist[node] = candidate;
          states[node] = "frontier";
          steps.push(graphStep("Релаксация", `Через ${current} расстояние до ${node} улучшается до ${candidate}.`, states, { [edge.id]: "success" }, { [`d(${node})`]: candidate }));
        }
      }
    }
    return steps;
  },
};

const dagEdges: VisualEdge[] = [
  { id: "AB", from: "A", to: "B", directed: true },
  { id: "AC", from: "A", to: "C", directed: true },
  { id: "BD", from: "B", to: "D", directed: true },
  { id: "CD", from: "C", to: "D", directed: true },
  { id: "CE", from: "C", to: "E", directed: true },
  { id: "DF", from: "D", to: "F", directed: true },
  { id: "EF", from: "E", to: "F", directed: true },
];

const topological: AlgorithmDefinition = {
  slug: "topological-sort",
  title: "Топологическая сортировка",
  shortTitle: "Topological Sort",
  category: "Графы",
  difficulty: "advanced",
  tier: "pro",
  kind: "graph",
  summary: "Линеаризует DAG так, чтобы каждая зависимость шла раньше потребителя.",
  intuition: "Вершина с нулевой входной степенью больше ни от кого не зависит и безопасна для следующей позиции.",
  complexity: { time: "O(V+E)", space: "O(V)", note: "Существование полного порядка эквивалентно отсутствию цикла." },
  pseudocode: ["compute indegrees", "queue all indegree=0", "pop and append", "decrease neighbors", "enqueue new zeroes"],
  tags: ["dag", "dependencies", "queue"],
  lessonGoal: "Связать порядок выполнения задач с входными степенями и обнаружением циклов.",
  buildSteps() {
    const indegree: Record<string, number> = Object.fromEntries(baseNodes.map((n) => [n.id, 0]));
    dagEdges.forEach((edge) => { indegree[edge.to] += 1; });
    const queue = baseNodes.map((n) => n.id).filter((id) => indegree[id] === 0);
    const order: string[] = [];
    const steps = [graphStep("Нулевые степени", `В очередь попадают: ${queue.join(", ")}.`, Object.fromEntries(queue.map((id) => [id, "frontier"])), {}, { order: "∅" }, dagEdges)];
    while (queue.length) {
      const current = queue.shift()!;
      order.push(current);
      const states: Record<string, VisualState> = {};
      order.forEach((id) => { states[id] = "visited"; });
      states[current] = "success";
      for (const edge of dagEdges.filter((item) => item.from === current)) {
        indegree[edge.to] -= 1;
        if (indegree[edge.to] === 0) queue.push(edge.to);
      }
      queue.forEach((id) => { states[id] = "frontier"; });
      steps.push(graphStep("Добавляем в порядок", `Порядок: ${order.join(" → ")}.`, states, {}, { queue: queue.join(" → ") || "∅" }, dagEdges));
    }
    return steps;
  },
};

const kruskal: AlgorithmDefinition = {
  slug: "kruskal",
  title: "Алгоритм Краскала",
  shortTitle: "Kruskal MST",
  category: "Графы",
  difficulty: "advanced",
  tier: "pro",
  kind: "graph",
  summary: "Строит минимальное остовное дерево, добавляя самые дешёвые рёбра без образования циклов.",
  intuition: "Если две компоненты ещё раздельны, самое дешёвое соединяющее их ребро безопасно добавить.",
  complexity: { time: "O(E log E)", space: "O(V)", note: "Union-Find делает проверку циклов практически постоянной." },
  pseudocode: ["sort edges by weight", "for edge in order", "  if endpoints disconnected", "    add edge", "    union components"],
  tags: ["mst", "greedy", "union-find"],
  lessonGoal: "Увидеть совместную работу жадного выбора и DSU-инварианта «цикл не создаётся».",
  buildSteps() {
    const ids = baseNodes.map((n) => n.id);
    const parent: Record<string, string> = Object.fromEntries(ids.map((id) => [id, id]));
    const find = (x: string): string => parent[x] === x ? x : (parent[x] = find(parent[x]));
    const selected = new Set<string>();
    const steps: AlgorithmStep[] = [];
    for (const edge of [...weightedEdges].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0))) {
      const ra = find(edge.from);
      const rb = find(edge.to);
      const edgeStates: Record<string, VisualState> = Object.fromEntries([...selected].map((id) => [id, "success"]));
      edgeStates[edge.id] = "active";
      if (ra !== rb) {
        parent[rb] = ra;
        selected.add(edge.id);
        edgeStates[edge.id] = "success";
        steps.push(graphStep("Берём ребро", `${edge.from}–${edge.to} вес ${edge.weight}: компоненты разные, ребро входит в MST.`, {}, edgeStates, { selected: selected.size }));
      } else {
        edgeStates[edge.id] = "muted";
        steps.push(graphStep("Пропускаем ребро", `${edge.from}–${edge.to} создало бы цикл.`, {}, edgeStates, { selected: selected.size }));
      }
      if (selected.size === baseNodes.length - 1) break;
    }
    return steps;
  },
};

const aStar: AlgorithmDefinition = {
  slug: "a-star",
  title: "A* поиск пути",
  shortTitle: "A*",
  category: "Графы",
  difficulty: "advanced",
  tier: "pro",
  kind: "graph",
  summary: "Комбинирует стоимость пройденного пути g и эвристику h до цели.",
  intuition: "Dijkstra ищет равномерно, а допустимая эвристика направляет поиск к цели, не ломая оптимальность.",
  complexity: { time: "Depends on heuristic", space: "O(V)", note: "При h=0 превращается в Dijkstra." },
  pseudocode: ["open = {start}", "pick min f=g+h", "relax neighbors", "stop when goal fixed"],
  tags: ["pathfinding", "heuristic", "graph"],
  lessonGoal: "Понять разницу между уже уплаченной стоимостью g и оценкой оставшегося пути h.",
  buildSteps() {
    const heuristic: Record<string, number> = { A: 7, B: 5, C: 5, D: 3, E: 2, F: 0 };
    const adj = adjacency(weightedEdges);
    const g: Record<string, number> = Object.fromEntries(baseNodes.map((n) => [n.id, Number.POSITIVE_INFINITY]));
    g.A = 0;
    const open = new Set<string>(["A"]);
    const closed = new Set<string>();
    const steps: AlgorithmStep[] = [];
    while (open.size) {
      const current = [...open].sort((a, b) => (g[a] + heuristic[a]) - (g[b] + heuristic[b]))[0];
      open.delete(current);
      closed.add(current);
      const states: Record<string, VisualState> = {};
      closed.forEach((id) => { states[id] = "visited"; });
      open.forEach((id) => { states[id] = "frontier"; });
      states[current] = current === "F" ? "success" : "active";
      steps.push(graphStep("Выбираем min f", `${current}: g=${g[current]}, h=${heuristic[current]}, f=${g[current] + heuristic[current]}.`, states));
      if (current === "F") break;
      for (const { node, edge } of adj.get(current) ?? []) {
        if (closed.has(node)) continue;
        const candidate = g[current] + (edge.weight ?? 1);
        if (candidate < g[node]) {
          g[node] = candidate;
          open.add(node);
          steps.push(graphStep("Улучшаем маршрут", `${node}: g=${candidate}, h=${heuristic[node]}, f=${candidate + heuristic[node]}.`, { ...states, [node]: "frontier" }, { [edge.id]: "success" }));
        }
      }
    }
    return steps;
  },
};

export const graphAlgorithms: AlgorithmDefinition[] = [bfs, dfs, dijkstra, topological, kruskal, aStar];
