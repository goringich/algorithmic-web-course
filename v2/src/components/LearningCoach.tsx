"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { algorithmBySlug } from "@/lib/algorithms";
import { buildLearningPlan, type LearningActionKind } from "@/lib/learning-plan";
import {
  parseProgressSnapshot,
  readProgressSnapshot,
  subscribeProgress,
} from "@/lib/progress";

const serverSnapshot = () => "";

const kindCopy: Record<LearningActionKind, { label: string; cta: string }> = {
  review: { label: "Повторение", cta: "Повторить" },
  "finish-trace": { label: "Незакрытый trace", cta: "Дойти до конца" },
  "finish-practice": { label: "Незакрытая практика", cta: "Закрыть checkpoint" },
  resume: { label: "Продолжение", cta: "Продолжить урок" },
  learn: { label: "Следующий урок", cta: "Начать урок" },
};

export function LearningCoach({ allowedSlugs }: { allowedSlugs: string[] }) {
  const rawProgress = useSyncExternalStore(
    subscribeProgress,
    readProgressSnapshot,
    serverSnapshot,
  );
  const progress = useMemo(() => parseProgressSnapshot(rawProgress), [rawProgress]);
  const plan = useMemo(
    () => buildLearningPlan(progress, allowedSlugs),
    [allowedSlugs, progress],
  );

  return (
    <section className="learning-coach panel" aria-labelledby="learning-coach-title">
      <div className="learning-coach-heading">
        <div>
          <span className="eyebrow">АДАПТИВНЫЙ МАРШРУТ</span>
          <h2 id="learning-coach-title">Фокус на ближайшую сессию</h2>
        </div>
        <p>
          План не угадывает: сначала защищает просроченные знания, затем закрывает незавершённые уроки и только после этого открывает новый материал.
        </p>
      </div>

      <div className="learning-coach-stats" aria-label="Состояние обучения">
        <div><strong>{plan.dueReviewCount}</strong><span>повторить сейчас</span></div>
        <div><strong>{plan.inProgressCount}</strong><span>уроков в работе</span></div>
        <div><strong>{plan.completionPercent}%</strong><span>курса освоено</span></div>
      </div>

      {plan.actions.length ? (
        <ol className="learning-queue">
          {plan.actions.map((action, index) => {
            const algorithm = algorithmBySlug.get(action.slug);
            if (!algorithm) return null;
            const copy = kindCopy[action.kind];
            return (
              <li className="learning-action" key={action.slug}>
                <span className="learning-action-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div className="learning-action-copy">
                  <div className="learning-action-title">
                    <span>{copy.label}</span>
                    <strong>{algorithm.title}</strong>
                  </div>
                  <p>{action.reason}</p>
                </div>
                <Link className="button button-secondary" href={`/course/${encodeURIComponent(action.slug)}`}>
                  {copy.cta}
                </Link>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="learning-coach-complete">
          <div>
            <strong>{plan.isComplete ? "Базовый маршрут освоен" : "Очередь пуста"}</strong>
            <p>
              {plan.nextReviewAt
                ? "Новых обязательных действий сейчас нет. Следующее интервальное повторение уже запланировано."
                : "Можно закрепить материал на свободной визуализации или пройти любой урок ещё раз без повышения review-streak раньше срока."}
            </p>
          </div>
          <Link className="button button-secondary" href="/playground">Открыть playground</Link>
        </div>
      )}

      <small className="learning-coach-note">
        Приоритеты считаются только из подтверждённого локального прогресса этого браузера. Они не повышают mastery без полного trace и checkpoint-практики.
      </small>
    </section>
  );
}
