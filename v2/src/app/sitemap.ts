import type { MetadataRoute } from "next";
import { algorithms } from "@/lib/algorithms";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticPages = ["", "/learn", "/playground", "/pricing", "/privacy", "/terms"].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 }));
  const lessons = algorithms.map((algorithm) => ({ url: `${base}/course/${algorithm.slug}`, changeFrequency: "monthly" as const, priority: 0.8 }));
  return [...staticPages, ...lessons];
}
