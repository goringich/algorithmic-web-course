import type { AlgorithmDefinition, AlgorithmStep, VisualItem, VisualState } from "./types";

const normalize = (input: number[] | undefined, fallback: number[]) => {
  const source = input?.filter(Number.isFinite).slice(0, 12) ?? [];
  return source.length >= 2 ? source : fallback;
};

const items = (values: number[], states: Record<number, VisualState> = {}): VisualItem[] =>
  values.map((value, index) => ({
    id: `i-${index}`,
    label: String(value),
    value,
    state: states[index] ?? "idle",
    secondary: String(index),
  }));

const step = (
  values: number[],
  title: string,
  description: string,
  states: Record<number, VisualState> = {},
  metrics?: Record<string, string | number>,
  codeLine?: number,
): AlgorithmStep => ({ title, description, items: items(values, states), metrics, codeLine });

const linearSearch: AlgorithmDefinition = {
  slug: "linear-search",
  title: "Линейный поиск",
  shortTitle: "Linear Search",
  category: "Поиск",
  difficulty: "starter",
  tier: "free",
  kind: "array",
  summary: "Проверяем элементы слева направо, пока не найдём цель.",
  intuition: "Если о данных ничего не известно, безопасная стратегия — проверить каждый кандидат ровно один раз.",
  complexity: { time: "O(n)", space: "O(1)", note: "В худшем случае просматривается весь массив." },
  pseudocode: ["for i = 0..n-1", "  if a[i] == target", "    return i", "return -1"],
  defaultInput: [7, 2, 9, 4, 6, 1, 8],
  acceptsArrayInput: true,
  tags: ["array", "search", "baseline"],
  lessonGoal: "Понять цену полного перебора и роль инварианта «всё слева уже проверено».",
  buildSteps(input) {
    const values = normalize(input, this.defaultInput!);
    const targetIndex = Math.min(values.length - 1, Math.max(1, Math.floor(values.length * 0.7)));
    const target = values[targetIndex];
    const steps: AlgorithmStep[] = [step(values, "Старт", `Ищем значение ${target}.`, { [targetIndex]: "target" }, { target })];
    for (let i = 0; i < values.length; i += 1) {
      const states: Record<number, VisualState> = { [targetIndex]: "target", [i]: "active" };
      for (let j = 0; j < i; j += 1) states[j] = "muted";
      steps.push(step(values, `Проверяем индекс ${i}`, `${values[i]} ${values[i] === target ? "совпадает" : "не совпадает"} с ${target}.`, states, { comparisons: i + 1 }, 2));
      if (values[i] === target) {
        states[i] = "success";
        steps.push(step(values, "Найдено", `Цель находится по индексу ${i}.`, states, { comparisons: i + 1 }, 3));
        break;
      }
    }
    return steps;
  },
};

const binarySearch: AlgorithmDefinition = {
  slug: "binary-search",
  title: "Бинарный поиск",
  shortTitle: "Binary Search",
  category: "Поиск",
  difficulty: "starter",
  tier: "free",
  kind: "array",
  summary: "Сокращаем отсортированный диапазон поиска вдвое на каждом шаге.",
  intuition: "После сравнения с серединой одна половина диапазона гарантированно не содержит ответ.",
  complexity: { time: "O(log n)", space: "O(1)", note: "Требует монотонности или отсортированности." },
  pseudocode: ["l = 0, r = n - 1", "while l <= r", "  m = l + (r-l)/2", "  compare a[m] with target", "  discard one half"],
  defaultInput: [1, 3, 5, 7, 9, 12, 16, 21, 28],
  acceptsArrayInput: true,
  tags: ["sorted", "search", "divide"],
  lessonGoal: "Научиться формулировать условие, по которому можно навсегда отбросить половину кандидатов.",
  buildSteps(input) {
    const values = normalize(input, this.defaultInput!).sort((a, b) => a - b);
    const targetIndex = Math.min(values.length - 1, Math.max(1, Math.floor(values.length * 0.66)));
    const target = values[targetIndex];
    const steps: AlgorithmStep[] = [];
    let left = 0;
    let right = values.length - 1;
    let comparisons = 0;
    steps.push(step(values, "Старт", `Ищем ${target} в отсортированном массиве.`, { [targetIndex]: "target" }, { left, right, target }));
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      comparisons += 1;
      const states: Record<number, VisualState> = { [targetIndex]: "target", [mid]: "active" };
      values.forEach((_, index) => {
        if (index < left || index > right) states[index] = "muted";
      });
      steps.push(step(values, `Середина = ${mid}`, `Сравниваем ${values[mid]} с ${target}.`, states, { left, mid, right, comparisons }, 3));
      if (values[mid] === target) {
        states[mid] = "success";
        steps.push(step(values, "Найдено", `Ответ: индекс ${mid}.`, states, { comparisons }, 4));
        break;
      }
      if (values[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return steps;
  },
};

const bubbleSort: AlgorithmDefinition = {
  slug: "bubble-sort",
  title: "Сортировка пузырьком",
  shortTitle: "Bubble Sort",
  category: "Сортировки",
  difficulty: "starter",
  tier: "free",
  kind: "array",
  summary: "Соседние элементы меняются местами, если стоят в неправильном порядке.",
  intuition: "После каждого прохода максимальный из необработанных элементов «всплывает» вправо.",
  complexity: { time: "O(n²)", space: "O(1)", note: "Хороша для обучения, редко — для production." },
  pseudocode: ["repeat passes", "  compare adjacent values", "  swap if left > right", "  shrink unsorted suffix"],
  defaultInput: [7, 3, 8, 2, 6, 1],
  acceptsArrayInput: true,
  tags: ["sort", "swap", "in-place"],
  lessonGoal: "Увидеть, как локальные обмены создают глобально отсортированный суффикс.",
  buildSteps(input) {
    const values = normalize(input, this.defaultInput!).slice();
    const steps: AlgorithmStep[] = [step(values, "Старт", "Начинаем последовательные проходы.")];
    let comparisons = 0;
    let swaps = 0;
    for (let end = values.length - 1; end > 0; end -= 1) {
      let changed = false;
      for (let i = 0; i < end; i += 1) {
        comparisons += 1;
        steps.push(step(values, "Сравнение соседей", `${values[i]} и ${values[i + 1]}.`, { [i]: "compare", [i + 1]: "compare" }, { comparisons, swaps }));
        if (values[i] > values[i + 1]) {
          [values[i], values[i + 1]] = [values[i + 1], values[i]];
          swaps += 1;
          changed = true;
          steps.push(step(values, "Обмен", "Больший элемент перемещён вправо.", { [i]: "active", [i + 1]: "active" }, { comparisons, swaps }, 3));
        }
      }
      const sorted: Record<number, VisualState> = {};
      for (let i = end; i < values.length; i += 1) sorted[i] = "success";
      steps.push(step(values, "Проход завершён", "Правый суффикс уже на своих местах.", sorted, { comparisons, swaps }));
      if (!changed) break;
    }
    return [...steps, step(values, "Готово", "Массив отсортирован.", Object.fromEntries(values.map((_, i) => [i, "success" as const])), { comparisons, swaps })];
  },
};

const selectionSort: AlgorithmDefinition = {
  slug: "selection-sort",
  title: "Сортировка выбором",
  shortTitle: "Selection Sort",
  category: "Сортировки",
  difficulty: "starter",
  tier: "free",
  kind: "array",
  summary: "На каждом шаге выбираем минимум из оставшейся части.",
  intuition: "Префикс становится окончательно отсортированным по одному элементу.",
  complexity: { time: "O(n²)", space: "O(1)", note: "Делает мало обменов, но много сравнений." },
  pseudocode: ["for i = 0..n-1", "  min = i", "  scan suffix", "  swap a[i] and a[min]"],
  defaultInput: [9, 4, 7, 1, 6, 2],
  acceptsArrayInput: true,
  tags: ["sort", "minimum", "in-place"],
  lessonGoal: "Связать инвариант отсортированного префикса с поиском минимума.",
  buildSteps(input) {
    const values = normalize(input, this.defaultInput!).slice();
    const steps: AlgorithmStep[] = [step(values, "Старт", "Префикс пока пуст.")];
    let comparisons = 0;
    for (let i = 0; i < values.length - 1; i += 1) {
      let min = i;
      for (let j = i + 1; j < values.length; j += 1) {
        comparisons += 1;
        const states: Record<number, VisualState> = { [min]: "active", [j]: "compare" };
        for (let k = 0; k < i; k += 1) states[k] = "success";
        steps.push(step(values, "Ищем минимум", `Текущий минимум ${values[min]}, кандидат ${values[j]}.`, states, { comparisons }));
        if (values[j] < values[min]) min = j;
      }
      [values[i], values[min]] = [values[min], values[i]];
      const states: Record<number, VisualState> = { [i]: "success" };
      for (let k = 0; k < i; k += 1) states[k] = "success";
      steps.push(step(values, "Фиксируем минимум", `На позиции ${i} теперь ${values[i]}.`, states, { comparisons }, 4));
    }
    return [...steps, step(values, "Готово", "Каждый элемент на своём месте.", Object.fromEntries(values.map((_, i) => [i, "success" as const])), { comparisons })];
  },
};

const insertionSort: AlgorithmDefinition = {
  slug: "insertion-sort",
  title: "Сортировка вставками",
  shortTitle: "Insertion Sort",
  category: "Сортировки",
  difficulty: "starter",
  tier: "pro",
  kind: "array",
  summary: "Берём следующий элемент и вставляем его в правильное место отсортированного префикса.",
  intuition: "Как сортировка карт в руке: слева всегда поддерживается правильный порядок.",
  complexity: { time: "O(n²)", space: "O(1)", note: "На почти отсортированных данных близка к O(n)." },
  pseudocode: ["for i = 1..n-1", "  key = a[i]", "  shift larger prefix values", "  place key"],
  defaultInput: [5, 2, 8, 3, 1, 7],
  acceptsArrayInput: true,
  tags: ["sort", "adaptive", "in-place"],
  lessonGoal: "Понять, почему почти отсортированные данные радикально облегчают задачу.",
  buildSteps(input) {
    const values = normalize(input, this.defaultInput!).slice();
    const steps: AlgorithmStep[] = [step(values, "Старт", "Первый элемент образует отсортированный префикс.", { 0: "success" })];
    let moves = 0;
    for (let i = 1; i < values.length; i += 1) {
      const key = values[i];
      let j = i - 1;
      steps.push(step(values, "Берём ключ", `Вставляем ${key} в префикс [0..${i - 1}].`, { [i]: "active" }));
      while (j >= 0 && values[j] > key) {
        values[j + 1] = values[j];
        moves += 1;
        steps.push(step(values, "Сдвиг вправо", `${values[j]} больше ${key}.`, { [j]: "compare", [j + 1]: "active" }, { moves }, 3));
        j -= 1;
      }
      values[j + 1] = key;
      const states: Record<number, VisualState> = {};
      for (let k = 0; k <= i; k += 1) states[k] = "success";
      steps.push(step(values, "Вставка", `${key} помещён на позицию ${j + 1}.`, states, { moves }, 4));
    }
    return steps;
  },
};

const mergeSort: AlgorithmDefinition = {
  slug: "merge-sort",
  title: "Сортировка слиянием",
  shortTitle: "Merge Sort",
  category: "Сортировки",
  difficulty: "core",
  tier: "pro",
  kind: "array",
  summary: "Делим массив на половины, сортируем их и сливаем обратно.",
  intuition: "Сливать два уже отсортированных списка можно одним линейным проходом.",
  complexity: { time: "O(n log n)", space: "O(n)", note: "Предсказуемая асимптотика и стабильность." },
  pseudocode: ["split array in halves", "sort left", "sort right", "merge sorted halves"],
  defaultInput: [8, 3, 6, 2, 7, 1, 5, 4],
  acceptsArrayInput: true,
  tags: ["sort", "divide-and-conquer", "stable"],
  lessonGoal: "Увидеть стоимость divide-and-conquer: log n уровней по n работы на каждом.",
  buildSteps(input) {
    const values = normalize(input, this.defaultInput!).slice();
    const work = values.slice();
    const steps: AlgorithmStep[] = [step(work, "Старт", "Разбиваем задачу на независимые половины.")];
    let writes = 0;
    const sortRange = (left: number, right: number) => {
      if (right - left <= 1) return;
      const mid = Math.floor((left + right) / 2);
      const rangeStates: Record<number, VisualState> = {};
      for (let i = left; i < right; i += 1) rangeStates[i] = "active";
      steps.push(step(work, "Деление", `Диапазон [${left}, ${right}) делим по ${mid}.`, rangeStates));
      sortRange(left, mid);
      sortRange(mid, right);
      const merged: number[] = [];
      let i = left;
      let j = mid;
      while (i < mid || j < right) {
        if (j >= right || (i < mid && work[i] <= work[j])) merged.push(work[i++]);
        else merged.push(work[j++]);
      }
      merged.forEach((value, offset) => {
        work[left + offset] = value;
        writes += 1;
      });
      const states: Record<number, VisualState> = {};
      for (let k = left; k < right; k += 1) states[k] = "success";
      steps.push(step(work, "Слияние", `Отсортировали [${left}, ${right}).`, states, { writes }, 4));
    };
    sortRange(0, work.length);
    return steps;
  },
};

const quickSort: AlgorithmDefinition = {
  slug: "quick-sort",
  title: "Быстрая сортировка",
  shortTitle: "Quick Sort",
  category: "Сортировки",
  difficulty: "core",
  tier: "pro",
  kind: "array",
  summary: "Разбиваем массив относительно pivot и рекурсивно сортируем части.",
  intuition: "После partition pivot уже находится на окончательной позиции.",
  complexity: { time: "O(n log n) average, O(n²) worst", space: "O(log n) average", note: "Качество pivot определяет баланс рекурсии." },
  pseudocode: ["choose pivot", "partition < pivot | pivot | >= pivot", "recurse left", "recurse right"],
  defaultInput: [6, 2, 8, 3, 7, 1, 5, 4],
  acceptsArrayInput: true,
  tags: ["sort", "partition", "divide-and-conquer"],
  lessonGoal: "Понять partition как ключевую операцию и увидеть риск несбалансированной рекурсии.",
  buildSteps(input) {
    const values = normalize(input, this.defaultInput!).slice();
    const steps: AlgorithmStep[] = [step(values, "Старт", "Будем фиксировать pivot по одному.")];
    let swaps = 0;
    const partition = (lo: number, hi: number) => {
      const pivot = values[hi];
      let boundary = lo;
      steps.push(step(values, "Pivot", `Pivot = ${pivot} на позиции ${hi}.`, { [hi]: "target" }));
      for (let i = lo; i < hi; i += 1) {
        steps.push(step(values, "Partition", `Сравниваем ${values[i]} с ${pivot}.`, { [i]: "compare", [hi]: "target", [boundary]: "active" }));
        if (values[i] < pivot) {
          [values[i], values[boundary]] = [values[boundary], values[i]];
          if (i !== boundary) swaps += 1;
          boundary += 1;
        }
      }
      [values[boundary], values[hi]] = [values[hi], values[boundary]];
      swaps += boundary === hi ? 0 : 1;
      steps.push(step(values, "Pivot зафиксирован", `${pivot} теперь на позиции ${boundary}.`, { [boundary]: "success" }, { swaps }, 3));
      return boundary;
    };
    const sort = (lo: number, hi: number) => {
      if (lo >= hi) return;
      const p = partition(lo, hi);
      sort(lo, p - 1);
      sort(p + 1, hi);
    };
    sort(0, values.length - 1);
    return [...steps, step(values, "Готово", "Массив отсортирован.", Object.fromEntries(values.map((_, i) => [i, "success" as const])), { swaps })];
  },
};

const heapSort: AlgorithmDefinition = {
  slug: "heap-sort",
  title: "Пирамидальная сортировка",
  shortTitle: "Heap Sort",
  category: "Сортировки",
  difficulty: "advanced",
  tier: "pro",
  kind: "array",
  summary: "Строим max-heap и последовательно переносим максимум в конец массива.",
  intuition: "Куча даёт максимум за O(1), а восстановление свойства занимает O(log n).",
  complexity: { time: "O(n log n)", space: "O(1)", note: "Гарантированная асимптотика без дополнительного массива." },
  pseudocode: ["build max heap", "swap root with end", "shrink heap", "sift root down", "repeat"],
  defaultInput: [4, 10, 3, 5, 1, 8, 2],
  acceptsArrayInput: true,
  tags: ["sort", "heap", "in-place"],
  lessonGoal: "Связать представление дерева в массиве с операцией sift-down.",
  buildSteps(input) {
    const values = normalize(input, this.defaultInput!).slice();
    const steps: AlgorithmStep[] = [step(values, "Старт", "Строим max-heap прямо в массиве.")];
    let swaps = 0;
    const sift = (size: number, root: number) => {
      let current = root;
      while (true) {
        let largest = current;
        const left = current * 2 + 1;
        const right = left + 1;
        if (left < size && values[left] > values[largest]) largest = left;
        if (right < size && values[right] > values[largest]) largest = right;
        if (largest === current) break;
        [values[current], values[largest]] = [values[largest], values[current]];
        swaps += 1;
        steps.push(step(values, "Sift-down", "Больший ребёнок поднимается вверх.", { [current]: "active", [largest]: "compare" }, { swaps }));
        current = largest;
      }
    };
    for (let i = Math.floor(values.length / 2) - 1; i >= 0; i -= 1) sift(values.length, i);
    steps.push(step(values, "Куча построена", "Максимум находится в корне.", { 0: "success" }, { swaps }));
    for (let end = values.length - 1; end > 0; end -= 1) {
      [values[0], values[end]] = [values[end], values[0]];
      swaps += 1;
      const states: Record<number, VisualState> = { [end]: "success" };
      for (let i = end + 1; i < values.length; i += 1) states[i] = "success";
      steps.push(step(values, "Извлекаем максимум", `Позиция ${end} зафиксирована.`, states, { swaps }));
      sift(end, 0);
    }
    return [...steps, step(values, "Готово", "Все позиции зафиксированы.", Object.fromEntries(values.map((_, i) => [i, "success" as const])), { swaps })];
  },
};

const twoPointers: AlgorithmDefinition = {
  slug: "two-pointers",
  title: "Два указателя",
  shortTitle: "Two Pointers",
  category: "Паттерны",
  difficulty: "core",
  tier: "pro",
  kind: "array",
  summary: "Два индекса двигаются навстречу друг другу и исключают целые диапазоны вариантов.",
  intuition: "В отсортированном массиве сумма подсказывает, какой указатель можно безопасно сдвинуть.",
  complexity: { time: "O(n)", space: "O(1)", note: "Часто заменяет квадратичный перебор пар." },
  pseudocode: ["l = 0, r = n-1", "while l < r", "  sum = a[l] + a[r]", "  move l or r using ordering"],
  defaultInput: [1, 2, 4, 6, 8, 11, 15],
  acceptsArrayInput: true,
  tags: ["pattern", "sorted", "pair"],
  lessonGoal: "Научиться превращать монотонность в безопасное исключение множества пар.",
  buildSteps(input) {
    const values = normalize(input, this.defaultInput!).sort((a, b) => a - b);
    const leftAnswer = Math.min(2, values.length - 2);
    const rightAnswer = Math.max(leftAnswer + 1, values.length - 2);
    const target = values[leftAnswer] + values[rightAnswer];
    const steps: AlgorithmStep[] = [step(values, "Старт", `Ищем пару с суммой ${target}.`, {}, { target })];
    let left = 0;
    let right = values.length - 1;
    while (left < right) {
      const sum = values[left] + values[right];
      steps.push(step(values, "Проверяем пару", `${values[left]} + ${values[right]} = ${sum}.`, { [left]: "active", [right]: "compare" }, { left, right, sum, target }));
      if (sum === target) {
        steps.push(step(values, "Пара найдена", `Индексы ${left} и ${right}.`, { [left]: "success", [right]: "success" }, { sum, target }));
        break;
      }
      if (sum < target) left += 1;
      else right -= 1;
    }
    return steps;
  },
};

const slidingWindow: AlgorithmDefinition = {
  slug: "sliding-window",
  title: "Скользящее окно",
  shortTitle: "Sliding Window",
  category: "Паттерны",
  difficulty: "core",
  tier: "pro",
  kind: "array",
  summary: "Поддерживаем агрегат по непрерывному диапазону вместо пересчёта с нуля.",
  intuition: "При сдвиге окно теряет один элемент и получает один новый — остальные уже посчитаны.",
  complexity: { time: "O(n)", space: "O(1)", note: "Для фиксированного окна сумма обновляется за O(1)." },
  pseudocode: ["sum first k", "for right = k..n-1", "  subtract outgoing", "  add incoming", "  update best"],
  defaultInput: [4, 2, 7, 1, 8, 3, 6, 5],
  acceptsArrayInput: true,
  tags: ["pattern", "subarray", "aggregate"],
  lessonGoal: "Увидеть повторное использование вычислений между соседними подмассивами.",
  buildSteps(input) {
    const values = normalize(input, this.defaultInput!);
    const k = Math.min(3, values.length);
    let sum = values.slice(0, k).reduce((a, b) => a + b, 0);
    let best = sum;
    const steps: AlgorithmStep[] = [];
    for (let start = 0; start <= values.length - k; start += 1) {
      if (start > 0) sum += values[start + k - 1] - values[start - 1];
      best = Math.max(best, sum);
      const states: Record<number, VisualState> = {};
      for (let i = start; i < start + k; i += 1) states[i] = sum === best ? "success" : "active";
      steps.push(step(values, `Окно [${start}, ${start + k})`, `Сумма = ${sum}, лучший результат = ${best}.`, states, { k, sum, best }));
    }
    return steps;
  },
};

const prefixSums: AlgorithmDefinition = {
  slug: "prefix-sums",
  title: "Префиксные суммы",
  shortTitle: "Prefix Sums",
  category: "Паттерны",
  difficulty: "starter",
  tier: "pro",
  kind: "array",
  summary: "Один линейный препроцессинг превращает суммы диапазонов в O(1)-запросы.",
  intuition: "Сумма [l, r] равна разности двух накопленных префиксов.",
  complexity: { time: "O(n) build, O(1) query", space: "O(n)", note: "Классический обмен памяти на скорость запросов." },
  pseudocode: ["prefix[0] = 0", "prefix[i+1] = prefix[i] + a[i]", "range(l,r) = prefix[r+1]-prefix[l]"],
  defaultInput: [3, 1, 4, 1, 5, 9],
  acceptsArrayInput: true,
  tags: ["prefix", "range-query", "precompute"],
  lessonGoal: "Понять препроцессинг как способ ускорить множество последующих запросов.",
  buildSteps(input) {
    const source = normalize(input, this.defaultInput!);
    const prefix = Array(source.length).fill(0) as number[];
    const steps: AlgorithmStep[] = [step(source, "Исходные данные", "Строим накопленные суммы слева направо.")];
    let running = 0;
    for (let i = 0; i < source.length; i += 1) {
      running += source[i];
      prefix[i] = running;
      const states: Record<number, VisualState> = {};
      for (let j = 0; j <= i; j += 1) states[j] = "success";
      steps.push(step(prefix, "Добавляем элемент", `prefix[${i}] = ${running}.`, states, { running }));
    }
    const left = Math.min(1, source.length - 1);
    const right = Math.max(left, source.length - 2);
    const answer = prefix[right] - (left > 0 ? prefix[left - 1] : 0);
    steps.push(step(prefix, "Запрос диапазона", `Сумма исходного массива [${left}, ${right}] = ${answer}.`, { [right]: "active", ...(left > 0 ? { [left - 1]: "compare" as const } : {}) }, { answer }));
    return steps;
  },
};

const kadane: AlgorithmDefinition = {
  slug: "kadane",
  title: "Алгоритм Кадане",
  shortTitle: "Kadane",
  category: "Динамика",
  difficulty: "core",
  tier: "pro",
  kind: "array",
  summary: "Находим максимальную сумму непрерывного подмассива за один проход.",
  intuition: "Отрицательный накопленный префикс только мешает любому будущему продолжению.",
  complexity: { time: "O(n)", space: "O(1)", note: "Минимальная динамика: состояние зависит только от предыдущего шага." },
  pseudocode: ["current = best = a[0]", "for x in a[1..]", "  current = max(x, current+x)", "  best = max(best,current)"],
  defaultInput: [-2, 3, -1, 5, -6, 4, 2, -1],
  acceptsArrayInput: true,
  tags: ["dp", "subarray", "optimization"],
  lessonGoal: "Научиться отбрасывать состояние, которое гарантированно ухудшит любой будущий ответ.",
  buildSteps(input) {
    const values = normalize(input, this.defaultInput!);
    let current = values[0];
    let best = values[0];
    let currentStart = 0;
    let bestStart = 0;
    let bestEnd = 0;
    const steps: AlgorithmStep[] = [step(values, "Старт", `current = best = ${values[0]}.`, { 0: "active" }, { current, best })];
    for (let i = 1; i < values.length; i += 1) {
      if (values[i] > current + values[i]) {
        current = values[i];
        currentStart = i;
      } else current += values[i];
      if (current > best) {
        best = current;
        bestStart = currentStart;
        bestEnd = i;
      }
      const states: Record<number, VisualState> = {};
      for (let j = currentStart; j <= i; j += 1) states[j] = "active";
      for (let j = bestStart; j <= bestEnd; j += 1) states[j] = "success";
      steps.push(step(values, `Индекс ${i}`, `Текущая сумма ${current}, лучшая ${best}.`, states, { current, best }));
    }
    return steps;
  },
};

export const arrayAlgorithms: AlgorithmDefinition[] = [
  linearSearch,
  binarySearch,
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  twoPointers,
  slidingWindow,
  prefixSums,
  kadane,
];
