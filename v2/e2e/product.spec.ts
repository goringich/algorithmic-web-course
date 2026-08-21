import { expect, test } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Parameters<typeof test>[0]["page"]) {
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
