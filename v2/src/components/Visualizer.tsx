"use client";

import { useEffect, useState } from "react";
import { markCompleted, setLastLesson } from "@/lib/progress";
import { track } from "@/lib/analytics";
import type { AccessTier, AlgorithmStep, VisualKind } from "@/lib/types";
import { VisualStage } from "./VisualStage";

const speeds = [1200, 700, 350] as const;

function parseInput(value: string, fallback: number[] | undefined) {
  const parsed = value
    .split(/[\s,;]+/)
    .map(Number)
    .filter(Number.isFinite)
    .slice(0, 12);
  return parsed.length >= 2 ? parsed : fallback;
}

export function Visualizer({
  slug,
  kind,
  tier,
  acceptsArrayInput,
  defaultInput,
  initialSteps,
}: {
  slug: string;
  kind: VisualKind;
  tier: AccessTier;
  acceptsArrayInput?: boolean;
  defaultInput?: number[];
  initialSteps: AlgorithmStep[];
}) {
  const [input, setInput] = useState(() => defaultInput?.join(", ") ?? "");
  const [steps, setSteps] = useState(initialSteps);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const step = steps[Math.min(stepIndex, Math.max(steps.length - 1, 0))];

  useEffect(() => {
    setLastLesson(slug);
    track("algorithm_open", { slug, tier });
  }, [slug, tier]);

  useEffect(() => {
    if (!playing || steps.length < 2) return;
    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= steps.length - 1) {
          setPlaying(false);
          markCompleted(slug);
          track("visualization_complete", { slug, steps: steps.length });
          return current;
        }
        return current + 1;
      });
    }, speeds[speedIndex]);
    return () => window.clearInterval(timer);
  }, [playing, steps.length, speedIndex, slug]);

  async function applyInput() {
    setPlaying(false);
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/simulate/${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input: parseInput(input, defaultInput) }),
    }).catch(() => undefined);
    if (!response) {
      setError("Не удалось пересчитать визуализацию.");
      setLoading(false);
      return;
    }
    if (response.status === 403) {
      setError("Доступ к этому уроку закончился или не активирован.");
      setLoading(false);
      return;
    }
    const result = await response.json().catch(() => null) as { steps?: AlgorithmStep[] } | null;
    if (!response.ok || !Array.isArray(result?.steps) || result.steps.length === 0) {
      setError("Сервер не вернул корректную последовательность шагов.");
      setLoading(false);
      return;
    }
    setSteps(result.steps);
    setStepIndex(0);
    setLoading(false);
  }

  if (!step) return <div className="panel">Визуализация пока недоступна.</div>;
  const progress = steps.length <= 1 ? 100 : Math.round((stepIndex / (steps.length - 1)) * 100);

  return (
    <section className="visualizer-shell">
      <div className="visualizer-toolbar">
        <div>
          <span className="eyebrow">ИНТЕРАКТИВНЫЙ РАЗБОР</span>
          <h2>{step.title}</h2>
          <p>{step.description}</p>
        </div>
        <div className="step-counter">{stepIndex + 1} / {steps.length}</div>
      </div>
      <div className="progress-track" aria-label={`Прогресс ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      <div className="visualizer-stage-panel"><VisualStage step={step} kind={kind} /></div>
      {step.metrics && Object.keys(step.metrics).length ? (
        <div className="metrics-row">
          {Object.entries(step.metrics).map(([key, value]) => <div className="metric-pill" key={key}><span>{key}</span><strong>{String(value)}</strong></div>)}
        </div>
      ) : null}
      {error ? <div className="visualizer-error">{error}</div> : null}
      <div className="visualizer-controls">
        <button className="button button-ghost" type="button" onClick={() => { setPlaying(false); setStepIndex(0); }}>Сначала</button>
        <button className="button button-ghost" type="button" disabled={stepIndex === 0} onClick={() => { setPlaying(false); setStepIndex((i) => Math.max(0, i - 1)); }}>← Шаг</button>
        <button className="button button-primary" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Пауза" : "Запустить"}</button>
        <button className="button button-ghost" type="button" disabled={stepIndex >= steps.length - 1} onClick={() => { setPlaying(false); setStepIndex((i) => Math.min(steps.length - 1, i + 1)); }}>Шаг →</button>
        <button className="button button-ghost" type="button" onClick={() => setSpeedIndex((i) => (i + 1) % speeds.length)}>Скорость ×{[0.6, 1, 2][speedIndex]}</button>
      </div>
      {acceptsArrayInput ? (
        <div className="custom-input-row">
          <label className="input-control"><span>Свои данные — до 12 чисел</span><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="7, 2, 9, 4, 6" /></label>
          <button className="button button-ghost" disabled={loading} type="button" onClick={applyInput}>{loading ? "Считаем…" : "Применить"}</button>
        </div>
      ) : null}
    </section>
  );
}
