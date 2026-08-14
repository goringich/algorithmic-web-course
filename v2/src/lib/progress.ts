const KEY = "algohar-v2-progress";

export type ProgressState = {
  completed: string[];
  opened: string[];
  lastLesson?: string;
};

const empty = (): ProgressState => ({ completed: [], opened: [] });

function strings(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function readProgress(): ProgressState {
  if (typeof window === "undefined") return empty();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Partial<ProgressState>;
    const completed = strings(parsed.completed);
    const opened = Array.from(new Set([...completed, ...strings(parsed.opened)]));
    return {
      completed,
      opened,
      lastLesson: typeof parsed.lastLesson === "string" ? parsed.lastLesson : undefined,
    };
  } catch {
    return empty();
  }
}

function writeProgress(progress: ProgressState) {
  window.localStorage.setItem(KEY, JSON.stringify(progress));
  return progress;
}

export function markOpened(slug: string): ProgressState {
  const current = readProgress();
  return writeProgress({
    ...current,
    opened: Array.from(new Set([...current.opened, slug])),
    lastLesson: slug,
  });
}

export function markCompleted(slug: string): ProgressState {
  const current = readProgress();
  return writeProgress({
    ...current,
    completed: Array.from(new Set([...current.completed, slug])),
    opened: Array.from(new Set([...current.opened, slug])),
    lastLesson: slug,
  });
}
