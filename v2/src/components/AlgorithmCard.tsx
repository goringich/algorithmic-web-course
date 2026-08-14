import Link from "next/link";
import type { AlgorithmDefinition } from "@/lib/types";

const difficultyLabel = {
  starter: "Старт",
  core: "Основа",
  advanced: "Продвинутый",
} as const;

export function AlgorithmCard({ algorithm }: { algorithm: AlgorithmDefinition }) {
  return (
    <Link className="algorithm-card" href={`/course/${algorithm.slug}`}>
      <div className="card-topline">
        <span className="chip">{algorithm.category}</span>
        <span className={`tier-badge ${algorithm.tier === "pro" ? "tier-pro" : "tier-free"}`}>
          {algorithm.tier === "pro" ? "PRO" : "FREE"}
        </span>
      </div>
      <h3>{algorithm.title}</h3>
      <p>{algorithm.summary}</p>
      <div className="card-footer">
        <span>{difficultyLabel[algorithm.difficulty]}</span>
        <span>{algorithm.complexity.time}</span>
      </div>
    </Link>
  );
}
