"use client";

import { FormEvent, useState } from "react";
import { track } from "@/lib/analytics";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "unconfigured" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contact: String(form.get("contact") ?? ""),
        goal: String(form.get("goal") ?? ""),
        source: "pricing_waitlist",
      }),
    }).catch(() => undefined);
    if (!response) return setStatus("error");
    const result = await response.json().catch(() => ({ configured: false }));
    if (response.ok && result.configured) {
      setStatus("sent");
      track("lead_submit", { source: "pricing_waitlist" });
      event.currentTarget.reset();
    } else if (response.ok) setStatus("unconfigured");
    else setStatus("error");
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          <span>Telegram или email</span>
          <input name="contact" minLength={3} maxLength={160} required placeholder="@username или you@example.com" />
        </label>
        <label>
          <span>Для чего учишь алгоритмы?</span>
          <input name="goal" maxLength={400} placeholder="ВШЭ, собеседование, олимпиады…" />
        </label>
      </div>
      <button className="button button-primary" disabled={status === "sending"} type="submit">
        {status === "sending" ? "Отправляем…" : "В ранний доступ"}
      </button>
      {status === "sent" ? <p className="form-status success-text">Заявка принята.</p> : null}
      {status === "unconfigured" ? <p className="form-status warning-text">Форма готова, но канал заявок ещё не подключён. До запуска нужно задать LEAD_WEBHOOK_URL.</p> : null}
      {status === "error" ? <p className="form-status warning-text">Не удалось отправить. Попробуй позже.</p> : null}
    </form>
  );
}
