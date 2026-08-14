"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import { readProgress, setLastLesson } from "@/lib/progress";
import type { AccessTier } from "@/lib/types";

export function LessonAnalytics({ slug, tier }: { slug: string; tier: AccessTier }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    const previousLesson = readProgress().lastLesson;
    if (previousLesson && previousLesson !== slug) {
      track("second_lesson_open", { slug, previousLesson, tier });
    }
    setLastLesson(slug);
    track("algorithm_open", { slug, tier });
  }, [slug, tier]);

  return null;
}
