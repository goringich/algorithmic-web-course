"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import { markOpened, readProgress } from "@/lib/progress";
import type { AccessTier } from "@/lib/types";

export function LessonAnalytics({ slug, tier }: { slug: string; tier: AccessTier }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const before = readProgress();
    const isNewLesson = !before.opened.includes(slug);
    if (isNewLesson && before.opened.length === 1) {
      track("second_lesson_open", {
        slug,
        previousLesson: before.lastLesson ?? before.opened[0],
        tier,
      });
    }

    markOpened(slug);
    track("algorithm_open", { slug, tier });
  }, [slug, tier]);

  return null;
}
