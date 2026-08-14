import { notFound } from "next/navigation";
import Link from "next/link";
import { algorithms, algorithmBySlug } from "@/lib/algorithms";
import { hasFullEntitlement } from "@/lib/entitlement";
import { Visualizer } from "@/components/Visualizer";

export function generateStaticParams() {
  return algorithms.map((algorithm) => ({ slug: algorithm.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const algorithm = algorithmBySlug.get(slug);
  if (!algorithm) return {};
  return { title: algorithm.title, description: algorithm.summary };
}

export default async function CourseLesson({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const algorithm = algorithmBySlug.get(slug);
  if (!algorithm) notFound();
  const entitled = algorithm.tier === "free" || await hasFullEntitlement();
  const initialSteps = entitled ? algorithm.buildSteps(algorithm.defaultInput) : [];

  return (
    <div className="shell lesson-shell">
      <Link className="back-link" href="/learn">← Ко всем урокам</Link>
      <div className="lesson-heading">
        <div>
          <div className="card-topline"><span className="chip">{algorithm.category}</span><span className={`tier-badge ${algorithm.tier === "pro" ? "tier-pro" : "tier-free"}`}>{algorithm.tier === "pro" ? "PRO" : "FREE"}</span></div>
          <h1>{algorithm.title}</h1>
          <p>{algorithm.summary}</p>
        </div>
        <div className="complexity-card"><span>Время</span><strong>{algorithm.complexity.time}</strong><span>Память</span><strong>{algorithm.complexity.space}</strong></div>
      </div>
      <div className="lesson-grid">
        <aside className="theory-panel panel">
          <span className="eyebrow">ИНТУИЦИЯ</span>
          <p>{algorithm.intuition}</p>
          <h3>Что должно остаться в голове</h3><p>{algorithm.lessonGoal}</p>
          <h3>Псевдокод</h3><pre>{algorithm.pseudocode.join("\n")}</pre>
          <h3>Сложность</h3><p>{algorithm.complexity.note}</p>
        </aside>
        {entitled ? (
          <Visualizer slug={algorithm.slug} kind={algorithm.kind} tier={algorithm.tier} acceptsArrayInput={algorithm.acceptsArrayInput} defaultInput={algorithm.defaultInput} initialSteps={initialSteps} />
        ) : (
          <section className="locked-lesson panel">
            <span className="eyebrow">ALGOHAR FULL</span>
            <h2>Интерактивный trace этого урока входит в полный курс</h2>
            <p>Теория остаётся доступной для оценки качества материала. Пошаговое исполнение и свои входные данные выдаются только после серверной проверки entitlement.</p>
            <Link className="button button-primary" href="/pricing">Посмотреть ранний доступ</Link>
          </section>
        )}
      </div>
    </div>
  );
}
