const KEY = "algohar-v2-progress";

export type ProgressState = {
  completed: string[];
  lastLesson?: string;
};

const empty = (): ProgressState => ({ completed: [] });

export function readProgress(): ProgressState {
  if (typeof window === "undefined") return empty();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Partial<ProgressState>;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((item): item is string => typeof item === "string") : [],
      lastLesson: typeof parsed.lastLesson === "string" ? parsed.lastLesson : undefined,
    };
  } catch {
    return empty();
  }
}

export function markCompleted(slug: string): ProgressState {
  const current = readProgress();
  const completed = Array.from(new Set([...current.completed, slug]));
  const next = { completed, lastLesson: slug };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function setLastLesson(slug: string) {
  const current = readProgress();
  window.localStorage.setItem(KEY, JSON.stringify({ ...current, lastLesson: slug }));
}
