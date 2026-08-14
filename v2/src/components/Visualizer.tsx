"use client";

import { useEffect, useMemo, useState } from "react";
import { algorithmBySlug } from "@/lib/algorithms";
import { markCompleted, setLastLesson } from "@/lib/progress";
import { track } from "@/lib/analytics";
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

export function Visualizer({ slug }: { slug: string }) {
  const algorithm = algorithmBySlug.get(slug);
  const [input, setInput] = useState(() => algorithm?.defaultInput?.join(", ") ?? "");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const data = useMemo(() => parseInput(input, algorithm?.defaultInput), [input, algorithm?.defaultInput]);
  const steps = useMemo(() => algorithm?.buildSteps(data) ?? [], [algorithm, data]);
  const step = steps[Math.min(stepIndex, Math.max(steps.length - 1, 0))];

  useEffect(() => {
    if (!algorithm) return;
    setLastLesson(algorithm.slug);
    track("algorithm_open", { slug: algorithm.slug, tier: algorithm.tier });
  }, [algorithm]);

  useEffect(() => {
    if (!playing || steps.length < 2) return;
    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= steps.length - 1) {
          setPlaying(false);
          if (algorithm) {
            markCompleted(algorithm.slug);
            track("visualization_complete", { slug: algorithm.slug, steps: steps.length });
          }
          return current;
        }
        return current + 1;
      });
    }, speeds[speedIndex]);
    return () => window.clearInterval(timer);
  }, [playing, steps.length, speedIndex, algorithm]);

  if (!algorithm || !step) return <div className="panel">Визуализация пока недоступна.</div>;

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

      <div className="progress-track" aria-label={`Прогресс ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="visualizer-stage-panel">
        <VisualStage step={step} kind={algorithm.kind} />
      </div>

      {step.metrics && Object.keys(step.metrics).length ? (
        <div className="metrics-row">
          {Object.entries(step.metrics).map(([key, value]) => (
            <div className="metric-pill" key={key}><span>{key}</span><strong>{String(value)}</strong></div>
          ))}
        </div>
      ) : null}

      <div className="visualizer-controls">
        <button className="button button-ghost" type="button" onClick={() => { setPlaying(false); setStepIndex(0); }}>Сначала</button>
        <button className="button button-ghost" type="button" disabled={stepIndex === 0} onClick={() => { setPlaying(false); setStepIndex((i) => Math.max(0, i - 1)); }}>← Шаг</button>
        <button className="button button-primary" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Пауза" : "Запустить"}</button>
        <button className="button button-ghost" type="button" disabled={stepIndex >= steps.length - 1} onClick={() => { setPlaying(false); setStepIndex((i) => Math.min(steps.length - 1, i + 1)); }}>Шаг →</button>
        <button className="button button-ghost" type="button" onClick={() => setSpeedIndex((i) => (i + 1) % speeds.length)}>Скорость ×{[0.6, 1, 2][speedIndex]}</button>
      </div>

      {algorithm.acceptsArrayInput ? (
        <label className="input-control">
          <span>Свои данные — до 12 чисел</span>
          <input
            value={input}
            onChange={(event) => { setInput(event.target.value); setStepIndex(0); setPlaying(false); }}
            placeholder="7, 2, 9, 4, 6"
          />
        </label>
      ) : null}
    </section>
  );
}
