import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(fits).toBe(true);
}

test("landing is usable and hardened", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Не зубри алгоритмы");
  await expect(page.getByRole("link", { name: "Попробовать бесплатно" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("free lesson exposes a real controllable trace", async ({ page }) => {
  await page.goto("/course/binary-search");
  await expect(page.getByRole("heading", { level: 1, name: "Бинарный поиск" })).toBeVisible();
  await expect(page.locator(".visualizer-shell")).toBeVisible();
  await expect(page.locator(".step-counter")).toHaveText(/1 \/ \d+/);
  await page.getByRole("button", { name: "Шаг →", exact: true }).click();
  await expect(page.locator(".step-counter")).toHaveText(/2 \/ \d+/);
  await expectNoHorizontalOverflow(page);
});

test("paid lesson payload stays behind the server entitlement gate", async ({ page }) => {
  await page.goto("/course/segment-tree");
  await expect(page.getByRole("heading", { level: 1, name: "Дерево отрезков" })).toBeVisible();
  await expect(page.getByText("Интерактивный trace этого урока входит в полный курс")).toBeVisible();
  await expect(page.locator(".visualizer-shell")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Посмотреть ранний доступ" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("pricing fails closed to waitlist when checkout is not provisioned", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Сначала проверь формат бесплатно");
  await expect(page.getByRole("link", { name: "Записаться в ранний доступ" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Купить ранний доступ" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "В ранний доступ" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("mastery UI distinguishes trace completion from learned material", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("algohar-v2-progress", JSON.stringify({
      opened: ["binary-search"],
      visualized: ["binary-search"],
      practicePassed: ["binary-search"],
      mastered: ["binary-search"],
      review: {
        "binary-search": {
          streak: 1,
          lastPassedAt: "2026-08-20T00:00:00.000Z",
          dueAt: "2026-08-21T00:00:00.000Z",
        },
      },
      lastLesson: "binary-search",
    }));
  });
  await page.goto("/learn");
  await expect(page.getByText(/1 \/ \d+ освоено/)).toBeVisible();
  await expect(page.getByText("Trace пройден: 1. К повторению: 1.", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "Повторить · 1" })).toHaveAttribute("href", "/course/binary-search");
  await expectNoHorizontalOverflow(page);
});

test("analytics accepts mastery events but rejects cross-origin and oversized intake", async ({ request }) => {
  const mastery = await request.post("/api/events", {
    data: { event: "lesson_mastered", properties: { slug: "binary-search" }, occurredAt: "2026-08-21T12:00:00.000Z" },
  });
  expect(mastery.ok()).toBe(true);

  const crossOrigin = await request.post("/api/events", {
    headers: { origin: "https://evil.example" },
    data: { event: "landing_view" },
  });
  expect(crossOrigin.status()).toBe(403);

  const oversized = await request.post("/api/events", {
    data: { event: "landing_view", properties: { value: "x".repeat(14_000) } },
  });
  expect(oversized.status()).toBe(413);
});

test("unprovisioned lead intake never pretends delivery succeeded", async ({ request }) => {
  const response = await request.post("/api/lead", {
    data: { contact: "@learner", goal: "Алгоритмы", source: "qa" },
  });
  expect(response.status()).toBe(202);
  expect(await response.json()).toEqual({ ok: true, configured: false });
});
