import type { AlgorithmDefinition, AlgorithmStep, VisualItem, VisualState } from "./types";

const tokens = (text: string, states: Record<number, VisualState> = {}): VisualItem[] =>
  [...text].map((char, index) => ({ id: `c-${index}`, label: char, state: states[index] ?? "idle", secondary: String(index) }));

const kmp: AlgorithmDefinition = {
  slug: "kmp",
  title: "Алгоритм Кнута — Морриса — Пратта",
  shortTitle: "KMP",
  category: "Строки",
  difficulty: "advanced",
  tier: "pro",
  kind: "string",
  summary: "Ищет подстроку без возврата указателя текста назад, используя префикс-функцию шаблона.",
  intuition: "После несовпадения уже известная совпавшая часть подсказывает, какой собственный префикс можно сохранить.",
  complexity: { time: "O(n+m)", space: "O(m)", note: "Каждый указатель суммарно движется линейно." },
  pseudocode: ["build prefix function for pattern", "scan text with j", "on mismatch j = pi[j-1]", "on full match report position"],
  tags: ["string", "pattern-matching", "prefix-function"],
  lessonGoal: "Увидеть, как информация о самом шаблоне устраняет повторные сравнения текста.",
  buildSteps() {
    const text = "ABABACABABAC";
    const pattern = "ABABAC";
    const pi = Array(pattern.length).fill(0) as number[];
    const steps: AlgorithmStep[] = [];
    for (let i = 1; i < pattern.length; i += 1) {
      let j = pi[i - 1];
      while (j > 0 && pattern[i] !== pattern[j]) j = pi[j - 1];
      if (pattern[i] === pattern[j]) j += 1;
      pi[i] = j;
      steps.push({
        title: "Префикс-функция",
        description: `Для pattern[${i}] = ${pattern[i]} получаем π[${i}] = ${j}. Таблица: ${pi.join(" ")}.`,
        items: tokens(pattern, { [i]: "active", ...(j > 0 ? { [j - 1]: "success" as const } : {}) }),
        metrics: { phase: "prefix", i, pi: j },
      });
    }
    let j = 0;
    for (let i = 0; i < text.length; i += 1) {
      while (j > 0 && text[i] !== pattern[j]) {
        steps.push({
          title: "Несовпадение",
          description: `${text[i]} ≠ ${pattern[j]}. Не возвращаем i назад: j = π[${j - 1}] = ${pi[j - 1]}.`,
          items: tokens(text, { [i]: "compare" }),
          metrics: { textIndex: i, patternIndex: j },
        });
        j = pi[j - 1];
      }
      if (text[i] === pattern[j]) j += 1;
      const states: Record<number, VisualState> = { [i]: "active" };
      for (let k = Math.max(0, i - j + 1); k <= i; k += 1) states[k] = "visited";
      steps.push({
        title: "Сканируем текст",
        description: `i=${i}, совпавшая длина j=${j}.`,
        items: tokens(text, states),
        metrics: { textIndex: i, matched: j },
      });
      if (j === pattern.length) {
        const start = i - pattern.length + 1;
        const found: Record<number, VisualState> = {};
        for (let k = start; k <= i; k += 1) found[k] = "success";
        steps.push({ title: "Совпадение найдено", description: `Шаблон начинается с позиции ${start}.`, items: tokens(text, found), metrics: { start } });
        break;
      }
    }
    return steps;
  },
};

export const stringAlgorithms: AlgorithmDefinition[] = [kmp];
