import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav-row">
        <Link className="brand" href="/" aria-label="AlgoHar — главная">
          <span className="brand-mark">A</span>
          <span>AlgoHar</span>
        </Link>
        <nav className="nav-links" aria-label="Основная навигация">
          <Link href="/learn">Курс</Link>
          <Link href="/playground">Визуализатор</Link>
          <Link href="/pricing">Тарифы</Link>
        </nav>
        <Link className="button button-small button-primary" href="/learn">Начать</Link>
      </div>
    </header>
  );
}
