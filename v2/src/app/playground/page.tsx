import { AlgorithmCard } from "@/components/AlgorithmCard";
import { freeAlgorithms, proAlgorithms } from "@/lib/algorithms";

export const metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return (
    <div className="shell page-shell">
      <div className="page-heading">
        <span className="eyebrow">БЕСПЛАТНЫЙ PLAYGROUND</span>
        <h1>Проверь формат на настоящих алгоритмах</h1>
        <p>Бесплатный слой не обрезан до скриншотов: можно запускать, ставить на паузу, ходить по шагам и менять входные данные там, где это применимо.</p>
      </div>
      <h2 className="subsection-title">Бесплатно</h2>
      <div className="algorithm-grid">{freeAlgorithms.map((algorithm) => <AlgorithmCard key={algorithm.slug} algorithm={algorithm} />)}</div>
      <div className="locked-section">
        <div><span className="eyebrow">ПОЛНЫЙ КУРС</span><h2>Ещё {proAlgorithms.length} алгоритмов в основном маршруте</h2><p>Продвинутые сортировки, деревья диапазонов, графы, DSU, A* и KMP.</p></div>
        <a className="button button-primary" href="/pricing">Тарифы</a>
      </div>
    </div>
  );
}
