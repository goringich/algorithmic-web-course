import { LeadForm } from "@/components/LeadForm";
import { AnalyticsPing } from "@/components/AnalyticsPing";
import { TrackedCheckoutLink } from "@/components/TrackedCheckoutLink";
import { algorithms, freeAlgorithms } from "@/lib/algorithms";

export const metadata = { title: "Тарифы" };

export default function PricingPage() {
  const coreUrl = process.env.NEXT_PUBLIC_CHECKOUT_CORE_URL;
  return (
    <div className="shell page-shell">
      <AnalyticsPing event="pricing_view" properties={{ offer: "full_early_access" }} />
      <div className="page-heading centered-heading">
        <span className="eyebrow">ПРОСТАЯ МОНЕТИЗАЦИЯ</span>
        <h1>Сначала проверь формат бесплатно</h1>
        <p>Цена раннего доступа — гипотеза до первых оплаченных пользователей. Никаких выдуманных скидок и «тысяч выпускников».</p>
      </div>
      <div className="pricing-grid">
        <article className="price-card">
          <span className="chip">FREE</span>
          <h2>Playground</h2>
          <div className="price">0 ₽</div>
          <p>Для проверки визуального формата.</p>
          <ul><li>{freeAlgorithms.length} интерактивных алгоритмов</li><li>Пошаговый режим и скорость</li><li>Свои массивы</li><li>Локальное сохранение прогресса</li></ul>
          <a className="button button-ghost" href="/playground">Открыть бесплатно</a>
        </article>
        <article className="price-card featured-price">
          <span className="chip">EARLY ACCESS</span>
          <h2>AlgoHar Full</h2>
          <div className="price">2 990 ₽ <small>ранний запуск</small></div>
          <p>Гипотеза цены: после подтверждения спроса — 4 990 ₽ за lifetime-доступ.</p>
          <ul><li>Все {algorithms.length} визуализаций</li><li>6 последовательных модулей</li><li>Продвинутые графы и range structures</li><li>Будущие алгоритмы V2 в границах early-access программы</li></ul>
          {coreUrl ? (
            <TrackedCheckoutLink className="button button-primary" href={coreUrl} offer="full_early_access">Купить ранний доступ</TrackedCheckoutLink>
          ) : (
            <a className="button button-primary" href="#waitlist">Записаться в ранний доступ</a>
          )}
        </article>
      </div>
      <section className="waitlist panel" id="waitlist">
        <div><span className="eyebrow">ПЕРВЫЕ ПОЛЬЗОВАТЕЛИ</span><h2>Получить ранний доступ</h2><p>До подключения платёжного провайдера заявки идут через явный webhook-контур. Это не имитация checkout.</p></div>
        <LeadForm />
      </section>
    </div>
  );
}
