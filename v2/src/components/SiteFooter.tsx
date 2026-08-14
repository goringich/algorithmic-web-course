import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="brand"><span className="brand-mark">A</span><span>AlgoHar</span></div>
          <p className="muted">Алгоритмы, которые можно не только прочитать, но и прожить шаг за шагом.</p>
        </div>
        <div className="footer-links">
          <Link href="/learn">Курс</Link>
          <Link href="/playground">Визуализации</Link>
          <Link href="/pricing">Тарифы</Link>
          <Link href="/privacy">Конфиденциальность</Link>
          <Link href="/terms">Условия</Link>
        </div>
      </div>
    </footer>
  );
}
