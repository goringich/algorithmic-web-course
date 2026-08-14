import { AlgorithmCard } from "@/components/AlgorithmCard";
import { algorithmBySlug } from "@/lib/algorithms";
import { curriculum, totalLessons } from "@/lib/curriculum";

export const metadata = { title: "Курс" };

export default function LearnPage() {
  return (
    <div className="shell page-shell">
      <div className="page-heading">
        <span className="eyebrow">ПРОГРАММА · {totalLessons} УРОКОВ</span>
        <h1>Алгоритмы как система, а не набор рецептов</h1>
        <p>Маршрут построен от инвариантов и базовых контейнеров к диапазонам, графам и строковым алгоритмам.</p>
      </div>
      <div className="module-list">
        {curriculum.map((module) => (
          <section className="module-section" key={module.id}>
            <div className="module-heading"><div><span>{module.id.replace(/^0/, "").replace("-", " · ")}</span><h2>{module.title}</h2></div><p>{module.description}</p></div>
            <div className="algorithm-grid compact-grid">
              {module.slugs.map((slug) => algorithmBySlug.get(slug)).filter((item): item is NonNullable<typeof item> => Boolean(item)).map((algorithm) => <AlgorithmCard key={algorithm.slug} algorithm={algorithm} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
