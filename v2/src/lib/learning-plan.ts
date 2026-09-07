import { dueReviewSlugs, type ProgressState } from "./progress";

export type LearningActionKind =
  | "review"
  | "finish-trace"
  | "finish-practice"
  | "resume"
  | "learn";

export type LearningAction = {
  slug: string;
  kind: LearningActionKind;
  reason: string;
  dueAt?: string;
};

export type LearningPlan = {
  actions: LearningAction[];
  masteredCount: number;
  inProgressCount: number;
  dueReviewCount: number;
  completionPercent: number;
  nextReviewAt?: string;
  isComplete: boolean;
};

function actionForIncompleteLesson(progress: ProgressState, slug: string): LearningAction {
  const visualized = progress.visualized.includes(slug);
  const practicePassed = progress.practicePassed.includes(slug);

  if (practicePassed && !visualized) {
    return {
      slug,
      kind: "finish-trace",
      reason: "Checkpoint уже пройден. Заверши визуальный trace, чтобы подтвердить понимание алгоритма.",
    };
  }

  if (visualized && !practicePassed) {
    return {
      slug,
      kind: "finish-practice",
      reason: "Trace уже пройден. Закрой checkpoint-практику, чтобы урок стал освоенным.",
    };
  }

  return {
    slug,
    kind: "resume",
    reason: "Ты уже открывал этот урок. Продолжение незавершённого материала дешевле по вниманию, чем новый старт.",
  };
}

export function buildLearningPlan(
  progress: ProgressState,
  allowedSlugs: string[],
  now: Date | string = new Date(),
  limit = 4,
): LearningPlan {
  const allowed = new Set(allowedSlugs);
  const mastered = progress.mastered.filter((slug) => allowed.has(slug));
  const masteredSet = new Set(mastered);
  const openedSet = new Set(progress.opened.filter((slug) => allowed.has(slug)));
  const visualizedSet = new Set(progress.visualized.filter((slug) => allowed.has(slug)));
  const practiceSet = new Set(progress.practicePassed.filter((slug) => allowed.has(slug)));
  const due = dueReviewSlugs(progress, now).filter((slug) => allowed.has(slug));
  const dueSet = new Set(due);
  const actions: LearningAction[] = [];
  const queued = new Set<string>();

  const push = (action: LearningAction) => {
    if (actions.length >= Math.max(0, limit) || queued.has(action.slug)) return;
    queued.add(action.slug);
    actions.push(action);
  };

  for (const slug of due) {
    push({
      slug,
      kind: "review",
      reason: "Интервал повторения наступил. Повтор сейчас лучше защищает знание от забывания, чем новый урок.",
      dueAt: progress.review[slug]?.dueAt,
    });
  }

  if (
    progress.lastLesson &&
    allowed.has(progress.lastLesson) &&
    !masteredSet.has(progress.lastLesson) &&
    !dueSet.has(progress.lastLesson)
  ) {
    push(actionForIncompleteLesson(progress, progress.lastLesson));
  }

  for (const slug of allowedSlugs) {
    if (masteredSet.has(slug) || dueSet.has(slug) || queued.has(slug)) continue;
    if (visualizedSet.has(slug) || practiceSet.has(slug) || openedSet.has(slug)) {
      push(actionForIncompleteLesson(progress, slug));
    }
  }

  for (const slug of allowedSlugs) {
    if (masteredSet.has(slug) || queued.has(slug)) continue;
    if (!openedSet.has(slug) && !visualizedSet.has(slug) && !practiceSet.has(slug)) {
      push({
        slug,
        kind: "learn",
        reason: "Это следующий незакрытый урок в последовательности курса. Так сохраняются зависимости между темами.",
      });
      break;
    }
  }

  const inProgressCount = allowedSlugs.filter((slug) => (
    !masteredSet.has(slug) &&
    (openedSet.has(slug) || visualizedSet.has(slug) || practiceSet.has(slug))
  )).length;
  const completionPercent = allowedSlugs.length
    ? Math.round((mastered.length / allowedSlugs.length) * 100)
    : 0;
  const nowMs = typeof now === "string" ? Date.parse(now) : now.getTime();
  const nextReviewAt = mastered
    .map((slug) => progress.review[slug]?.dueAt)
    .filter((dueAt): dueAt is string => Boolean(dueAt) && Date.parse(dueAt) > nowMs)
    .sort()[0];

  return {
    actions,
    masteredCount: mastered.length,
    inProgressCount,
    dueReviewCount: due.length,
    completionPercent,
    nextReviewAt,
    isComplete: allowedSlugs.length > 0 && mastered.length === allowedSlugs.length,
  };
}
