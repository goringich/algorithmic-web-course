import type { CourseModule } from "./types";

export const curriculum: CourseModule[] = [
  {
    id: "01-foundations",
    title: "Модуль 1. Мышление и базовые структуры",
    description: "Цена операций, последовательный поиск, стек, очередь и связный список.",
    slugs: ["linear-search", "binary-search", "stack", "queue", "linked-list"],
  },
  {
    id: "02-sorting",
    title: "Модуль 2. Сортировки и инварианты",
    description: "От квадратичных сортировок к divide-and-conquer и куче.",
    slugs: ["bubble-sort", "selection-sort", "insertion-sort", "merge-sort", "quick-sort", "heap-sort"],
  },
  {
    id: "03-patterns",
    title: "Модуль 3. Паттерны массивов",
    description: "Как превращать повторный перебор в линейные решения.",
    slugs: ["two-pointers", "sliding-window", "prefix-sums", "kadane"],
  },
  {
    id: "04-trees",
    title: "Модуль 4. Деревья и диапазоны",
    description: "Кучи, BST, segment tree и Fenwick tree с реальными операциями.",
    slugs: ["binary-heap", "binary-search-tree", "segment-tree", "fenwick-tree"],
  },
  {
    id: "05-graphs",
    title: "Модуль 5. Графы",
    description: "Обходы, кратчайшие пути, зависимости, компоненты и MST.",
    slugs: ["bfs", "dfs", "dijkstra", "topological-sort", "union-find", "kruskal", "a-star"],
  },
  {
    id: "06-strings",
    title: "Модуль 6. Строковые алгоритмы",
    description: "Префикс-функция и линейный поиск шаблона.",
    slugs: ["kmp"],
  },
];

export const totalLessons = curriculum.reduce((sum, module) => sum + module.slugs.length, 0);
