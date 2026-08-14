"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import {
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
  const completed = progress.completed.filter((slug) => allowed.has(slug));
  const percent = allowedSlugs.length ? Math.round((completed.length / allowedSlugs.length) * 100) : 0;
  const canContinue = Boolean(progress.lastLesson && allowed.has(progress.lastLesson));

  return (
    <section className="course-progress panel" aria-label="Прогресс курса">
      <div className="course-progress-copy">
        <span className="eyebrow">ТВОЙ ПРОГРЕСС</span>
        <strong>{completed.length} / {allowedSlugs.length} уроков</strong>
        <p>Прогресс хранится в этом браузере. После появления аккаунтов он будет синхронизироваться серверно.</p>
      </div>
      <div className="course-progress-action">
        <div className="course-progress-meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={`Завершено ${percent}% курса`}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <small>{percent}% завершено</small>
        {canContinue ? <Link className="button button-primary" href={`/course/${encodeURIComponent(progress.lastLesson!)}`}>Продолжить</Link> : <Link className="button button-primary" href={`/course/${allowedSlugs[0]}`}>Начать первый урок</Link>}
      </div>
    </section>
  );
}
