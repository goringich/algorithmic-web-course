import Link from "next/link";
import { algorithms, freeAlgorithms } from "@/lib/algorithms";
import { curriculum } from "@/lib/curriculum";
import { AlgorithmCard } from "@/components/AlgorithmCard";
import { AnalyticsPing } from "@/components/AnalyticsPing";

export default function HomePage() {
  const featured = ["binary-search", "quick-sort", "segment-tree", "dijkstra", "a-star", "kmp"]
    .map((slug) => algorithms.find((algorithm) => algorithm.slug === slug))
    .filter((algorithm): algorithm is NonNullable<typeof algorithm> => Boolean(algorithm));

  return (
    <>
      <AnalyticsPing event="landing_view" />
      <section className="hero shell">
        <div className="hero-copy">
          <span className="eyebrow">ИНТЕРАКТИВНЫЙ КУРС ПО АЛГОРИТМАМ</span>
          <h1>Не зубри алгоритмы. <span className="gradient-text">Увидь, почему они работают.</span></h1>
          <p className="hero-lead">Пошаговая анимация, инварианты, сложность и свои входные данные в одном экране. От бинарного поиска до A*, Fenwick tree и KMP.</p>
          <div className="hero-actions">
            <Link className="button button-primary button-large" href="/learn">Открыть курс</Link>
            <Link className="button button-ghost button-large" href="/playground">Попробовать бесплатно</Link>
          </div>
          <div className="trust-line">Без установки · аккаунт не нужен для free-уроков · прогресс сохраняется локально</div>
        </div>
        <div className="hero-demo panel">
          <div className="demo-window-top"><span /><span /><span /><strong>binary-search.algohar</strong></div>
          <div className="demo-array">
            {[1, 3, 5, 7, 9, 12, 16].map((value, index) => <div className={index === 4 ? "demo-cell demo-active" : index < 3 ? "demo-cell demo-muted" : "demo-cell"} key={value}>{value}<small>{index}</small></div>)}
          </div>
          <div className="demo-caption"><span>left = 3</span><strong>mid = 4 → 9</strong><span>right = 6</span></div>
          <div className="demo-progress"><span /></div>
        </div>
      </section>

      <section className="stats-band">
        <div className="shell stats-grid">
          <div><strong>{algorithms.length}</strong><span>реальных симуляций</span></div>
          <div><strong>{curriculum.length}</strong><span>последовательных модулей</span></div>
          <div><strong>{freeAlgorithms.length}</strong><span>полных free-уроков</span></div>
          <div><strong>1</strong><span>единый visual engine</span></div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading"><div><span className="eyebrow">ПОПРОБУЙ СЕЙЧАС</span><h2>От базовых идей до продвинутых структур</h2></div><Link href="/learn">Все уроки →</Link></div>
        <div className="algorithm-grid">{featured.map((algorithm) => <AlgorithmCard key={algorithm.slug} algorithm={algorithm} />)}</div>
      </section>

      <section className="section shell split-section">
        <div>
          <span className="eyebrow">КАК УСТРОЕН УРОК</span>
          <h2>Один цикл обучения вместо пяти вкладок</h2>
          <p className="section-lead">Сначала формируется интуиция, затем ты управляешь алгоритмом вручную, видишь изменение состояния и только после этого закрепляешь сложность и псевдокод.</p>
        </div>
        <ol className="learning-loop">
          <li><strong>01</strong><div><b>Интуиция</b><span>Что мы можем отбросить и почему.</span></div></li>
          <li><strong>02</strong><div><b>Симуляция</b><span>Пауза, шаг назад, скорость, свои данные.</span></div></li>
          <li><strong>03</strong><div><b>Инвариант</b><span>Что гарантированно истинно после каждого шага.</span></div></li>
          <li><strong>04</strong><div><b>Код и сложность</b><span>Перевод визуальной модели в реализацию.</span></div></li>
        </ol>
      </section>

      <section className="cta-section shell panel">
        <div><span className="eyebrow">ALGOHAR V2</span><h2>Начни с бесплатного ядра.</h2><p>Платить имеет смысл только когда визуальный формат действительно помогает тебе учиться быстрее.</p></div>
        <Link className="button button-primary button-large" href="/playground">Открыть playground</Link>
      </section>
    </>
  );
}
