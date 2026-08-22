"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import {
  dueReviewSlugs,
  parseProgressSnapshot,
  readProgressSnapshot,
  subscribeProgress,
} from "@/lib/progress";

const serverSnapshot = () => "";

export function CourseProgress({ allowedSlugs }: { allowedSlugs: string[] }) {
  const rawProgress = useSyncExternalStore(
    subscribeProgress,
    readProgressSnapshot,
    serverSnapshot,
  );
  const progress = useMemo(() => parseProgressSnapshot(rawProgress), [rawProgress]);
  const allowed = useMemo(() => new Set(allowedSlugs), [allowedSlugs]);
  const mastered = progress.mastered.filter((slug) => allowed.has(slug));
  const visualized = progress.visualized.filter((slug) => allowed.has(slug));
  const due = dueReviewSlugs(progress).filter((slug) => allowed.has(slug));
  const percent = allowedSlugs.length ? Math.round((mastered.length / allowedSlugs.length) * 100) : 0;
  const canContinue = Boolean(progress.lastLesson && allowed.has(progress.lastLesson));
  const primaryHref = due[0]
    ? `/course/${encodeURIComponent(due[0])}`
    : canContinue
      ? `/course/${encodeURIComponent(progress.lastLesson!)}`
      : `/course/${allowedSlugs[0]}`;
  const primaryLabel = due.length ? `Повторить · ${due.length}` : canContinue ? "Продолжить" : "Начать первый урок";

  return (
    <section className="course-progress panel" aria-label="Прогресс курса">
      <div className="course-progress-copy">
        <span className="eyebrow">ТВОЙ ПРОГРЕСС</span>
        <strong>{mastered.length} / {allowedSlugs.length} освоено</strong>
        <p>
          Trace пройден: {visualized.length}. К повторению: {due.length}. Урок считается освоенным только после полного trace и двух верных checkpoint-ответов.
        </p>
        <small>Пока прогресс хранится только в этом браузере; серверная синхронизация остаётся launch-блокером.</small>
      </div>
      <div className="course-progress-action">
        <div className="course-progress-meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={`Освоено ${percent}% курса`}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <small>{percent}% освоено</small>
        <Link className="button button-primary" href={primaryHref}>{primaryLabel}</Link>
      </div>
    </section>
  );
}
