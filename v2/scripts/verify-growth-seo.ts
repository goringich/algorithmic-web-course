import assert from "node:assert/strict";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { algorithms } from "../src/lib/algorithms";

const origin = "https://algohar.example";
process.env.NEXT_PUBLIC_SITE_URL = origin;

const sitemapEntries = sitemap();
const sitemapUrls = sitemapEntries.map((entry) => entry.url);

assert.equal(
  new Set(sitemapUrls).size,
  sitemapUrls.length,
  "Sitemap URLs must be unique",
);

for (const url of sitemapUrls) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, origin, `Sitemap URL must stay on canonical origin: ${url}`);
  assert.equal(parsed.protocol, "https:", `Growth sitemap must use HTTPS canonical URLs: ${url}`);
  assert.equal(parsed.search, "", `Sitemap URL must not contain tracking/query parameters: ${url}`);
  assert.equal(parsed.hash, "", `Sitemap URL must not contain fragments: ${url}`);
  assert.ok(!parsed.pathname.startsWith("/api/"), `API route leaked into sitemap: ${url}`);
}

const expectedStaticPaths = ["/", "/learn", "/playground", "/pricing", "/privacy", "/terms"];
for (const path of expectedStaticPaths) {
  assert.ok(sitemapUrls.includes(`${origin}${path === "/" ? "" : path}`), `Missing public growth route in sitemap: ${path}`);
}

for (const algorithm of algorithms) {
  const lessonUrl = `${origin}/course/${algorithm.slug}`;
  assert.equal(
    sitemapUrls.filter((url) => url === lessonUrl).length,
    1,
    `Every catalog lesson must have exactly one indexable sitemap URL: ${algorithm.slug}`,
  );
  assert.ok(algorithm.title.trim().length > 0, `Algorithm title must be non-empty: ${algorithm.slug}`);
  assert.ok(algorithm.summary.trim().length >= 40, `Algorithm summary is too thin for a useful search snippet: ${algorithm.slug}`);
}

const robotsPolicy = robots();
assert.equal(robotsPolicy.sitemap, `${origin}/sitemap.xml`, "robots.txt must point to the canonical sitemap");

const rules = Array.isArray(robotsPolicy.rules) ? robotsPolicy.rules : [robotsPolicy.rules];
const wildcardRule = rules.find((rule) => rule.userAgent === "*");
assert.ok(wildcardRule, "robots.txt must define a wildcard crawler rule");
assert.equal(wildcardRule.allow, "/", "Public course surface should remain crawlable");
assert.ok(
  Array.isArray(wildcardRule.disallow) && wildcardRule.disallow.includes("/api/"),
  "Public API routes must be excluded from crawler discovery",
);

console.log(`Verified growth/SEO contract for ${algorithms.length} lessons and ${sitemapEntries.length} sitemap URLs.`);
