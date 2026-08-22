import assert from "node:assert/strict";
import {
  applyPracticePass,
  applyVisualizationComplete,
  dueReviewSlugs,
  parseProgressSnapshot,
  type ProgressState,
} from "../src/lib/progress";

const empty = (): ProgressState => ({
  opened: [],
  visualized: [],
  practicePassed: [],
  mastered: [],
  review: {},
});

const legacy = parseProgressSnapshot(JSON.stringify({
  completed: ["binary-search"],
  opened: ["binary-search"],
  lastLesson: "binary-search",
}));
assert.deepEqual(legacy.visualized, ["binary-search"], "legacy completion proves trace completion only");
assert.deepEqual(legacy.mastered, [], "legacy completion must never be silently upgraded to mastery");

const practiceFirst = applyPracticePass(
  empty(),
  "binary-search",
  "2026-08-21T10:00:00.000Z",
);
assert.deepEqual(practiceFirst.practicePassed, ["binary-search"]);
assert.deepEqual(practiceFirst.mastered, [], "practice without the visual trace is not mastery");

const masteredAfterTrace = applyVisualizationComplete(
  practiceFirst,
  "binary-search",
  "2026-08-21T10:05:00.000Z",
);
assert.deepEqual(masteredAfterTrace.mastered, ["binary-search"]);
assert.equal(masteredAfterTrace.review["binary-search"].streak, 1);
assert.equal(masteredAfterTrace.review["binary-search"].dueAt, "2026-08-22T10:05:00.000Z");

const visualFirst = applyVisualizationComplete(
  empty(),
  "segment-tree",
  "2026-08-21T11:00:00.000Z",
);
assert.deepEqual(visualFirst.mastered, [], "trace alone must not inflate course mastery");
const masteredAfterPractice = applyPracticePass(
  visualFirst,
  "segment-tree",
  "2026-08-21T11:10:00.000Z",
);
assert.deepEqual(masteredAfterPractice.mastered, ["segment-tree"]);
assert.equal(masteredAfterPractice.review["segment-tree"].dueAt, "2026-08-22T11:10:00.000Z");

const earlyRepeat = applyPracticePass(
  masteredAfterPractice,
  "segment-tree",
  "2026-08-21T18:00:00.000Z",
);
assert.equal(earlyRepeat.review["segment-tree"].streak, 1, "early repetition must not game the spaced-review streak");
assert.equal(earlyRepeat.review["segment-tree"].dueAt, "2026-08-22T11:10:00.000Z");

assert.deepEqual(
  dueReviewSlugs(earlyRepeat, "2026-08-22T11:09:59.000Z"),
  [],
  "lesson is not due before the scheduled instant",
);
assert.deepEqual(
  dueReviewSlugs(earlyRepeat, "2026-08-22T11:10:00.000Z"),
  ["segment-tree"],
  "lesson becomes due exactly at the review deadline",
);

const reviewed = applyPracticePass(
  earlyRepeat,
  "segment-tree",
  "2026-08-22T11:20:00.000Z",
);
assert.equal(reviewed.review["segment-tree"].streak, 2);
assert.equal(reviewed.review["segment-tree"].dueAt, "2026-08-25T11:20:00.000Z", "second successful review uses the 3-day interval");
assert.deepEqual(dueReviewSlugs(reviewed, "2026-08-23T00:00:00.000Z"), []);

const corrupted = parseProgressSnapshot(JSON.stringify({
  visualized: ["bfs"],
  practicePassed: ["bfs"],
  mastered: ["bfs", "not-earned"],
  review: {
    bfs: { streak: 1, dueAt: "2026-08-22T00:00:00.000Z", lastPassedAt: "2026-08-21T00:00:00.000Z" },
    broken: { streak: -1, dueAt: "not-a-date", lastPassedAt: "bad" },
  },
}));
assert.deepEqual(corrupted.mastered, ["bfs"], "mastery must remain backed by both trace and practice evidence");
assert.deepEqual(Object.keys(corrupted.review), ["bfs"], "malformed review state must fail closed");

console.log("learning progress verification passed");
