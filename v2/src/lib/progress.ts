const KEY = "algohar-v2-progress";
const CHANGE_EVENT = "algohar-progress-change";
const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30] as const;

export type ReviewState = {
  streak: number;
  dueAt: string;
  lastPassedAt: string;
};

export type ProgressState = {
  opened: string[];
  visualized: string[];
  practicePassed: string[];
  mastered: string[];
  review: Record<string, ReviewState>;
  lastLesson?: string;
};

const empty = (): ProgressState => ({
  opened: [],
  visualized: [],
  practicePassed: [],
  mastered: [],
  review: {},
});

function strings(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function parseReview(value: unknown): Record<string, ReviewState> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, ReviewState> = {};
  for (const [slug, raw] of Object.entries(value)) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const record = raw as Partial<ReviewState>;
    if (
      typeof record.streak !== "number" ||
      !Number.isInteger(record.streak) ||
      record.streak < 1 ||
      typeof record.dueAt !== "string" ||
      !Number.isFinite(Date.parse(record.dueAt)) ||
      typeof record.lastPassedAt !== "string" ||
      !Number.isFinite(Date.parse(record.lastPassedAt))
    ) continue;
    result[slug] = {
      streak: Math.min(record.streak, REVIEW_INTERVAL_DAYS.length),
      dueAt: record.dueAt,
      lastPassedAt: record.lastPassedAt,
    };
  }
  return result;
}

export function parseProgressSnapshot(raw: string): ProgressState {
  if (!raw) return empty();
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState> & { completed?: unknown };
    // `completed` was the pre-mastery field. It only proves that the learner
    // reached the last visualization step, so migrate it to `visualized`, not
    // to `mastered`.
    const visualized = unique([...strings(parsed.completed), ...strings(parsed.visualized)]);
    const practicePassed = unique(strings(parsed.practicePassed));
    const mastered = unique(strings(parsed.mastered)).filter(
      (slug) => visualized.includes(slug) && practicePassed.includes(slug),
    );
    const opened = unique([
      ...visualized,
      ...practicePassed,
      ...mastered,
      ...strings(parsed.opened),
    ]);
    const review = parseReview(parsed.review);
    for (const slug of Object.keys(review)) {
      if (!mastered.includes(slug)) delete review[slug];
    }
    return {
      opened,
      visualized,
      practicePassed,
      mastered,
      review,
      lastLesson: typeof parsed.lastLesson === "string" ? parsed.lastLesson : undefined,
    };
  } catch {
    return empty();
  }
}

function isoTime(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error("progress timestamp must be valid");
  return date.toISOString();
}

function scheduleReview(current: ReviewState | undefined, passedAt: string): ReviewState {
  const passedMs = Date.parse(passedAt);
  if (current && passedMs < Date.parse(current.dueAt)) {
    return { ...current, lastPassedAt: passedAt };
  }
  const streak = current
    ? Math.min(current.streak + 1, REVIEW_INTERVAL_DAYS.length)
    : 1;
  const intervalDays = REVIEW_INTERVAL_DAYS[streak - 1];
  return {
    streak,
    lastPassedAt: passedAt,
    dueAt: new Date(passedMs + intervalDays * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function applyVisualizationComplete(
  progress: ProgressState,
  slug: string,
  completedAt: Date | string,
): ProgressState {
  const timestamp = isoTime(completedAt);
  const visualized = unique([...progress.visualized, slug]);
  const alreadyMastered = progress.mastered.includes(slug);
  const canPromote = !alreadyMastered && progress.practicePassed.includes(slug);
  return {
    ...progress,
    opened: unique([...progress.opened, slug]),
    visualized,
    mastered: canPromote ? unique([...progress.mastered, slug]) : progress.mastered,
    review: canPromote
      ? { ...progress.review, [slug]: scheduleReview(undefined, timestamp) }
      : progress.review,
    lastLesson: slug,
  };
}

export function applyPracticePass(
  progress: ProgressState,
  slug: string,
  passedAt: Date | string,
): ProgressState {
  const timestamp = isoTime(passedAt);
  const practicePassed = unique([...progress.practicePassed, slug]);
  const canMaster = progress.visualized.includes(slug);
  const alreadyMastered = progress.mastered.includes(slug);
  const mastered = canMaster ? unique([...progress.mastered, slug]) : progress.mastered;
  const review = canMaster
    ? {
        ...progress.review,
        [slug]: scheduleReview(alreadyMastered ? progress.review[slug] : undefined, timestamp),
      }
    : progress.review;
  return {
    ...progress,
    opened: unique([...progress.opened, slug]),
    practicePassed,
    mastered,
    review,
    lastLesson: slug,
  };
}

export function dueReviewSlugs(progress: ProgressState, now: Date | string = new Date()) {
  const nowMs = Date.parse(isoTime(now));
  return progress.mastered
    .filter((slug) => {
      const record = progress.review[slug];
      return record && Date.parse(record.dueAt) <= nowMs;
    })
    .sort((left, right) => progress.review[left].dueAt.localeCompare(progress.review[right].dueAt));
}

export function readProgressSnapshot() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(KEY) ?? "";
}

export function subscribeProgress(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) listener();
  };
  const onLocalChange = () => listener();

  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onLocalChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onLocalChange);
  };
}

export function readProgress(): ProgressState {
  return parseProgressSnapshot(readProgressSnapshot());
}

function writeProgress(progress: ProgressState) {
  window.localStorage.setItem(KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return progress;
}

export function markOpened(slug: string): ProgressState {
  const current = readProgress();
  return writeProgress({
    ...current,
    opened: unique([...current.opened, slug]),
    lastLesson: slug,
  });
}

export function markVisualized(slug: string): ProgressState {
  return writeProgress(applyVisualizationComplete(readProgress(), slug, new Date()));
}

export function markPracticePassed(slug: string): ProgressState {
  return writeProgress(applyPracticePass(readProgress(), slug, new Date()));
}
