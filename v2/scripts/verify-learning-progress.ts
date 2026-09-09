import assert from "node:assert/strict";
import { buildLearningPlan } from "../src/lib/learning-plan";
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

const firstPlan = buildLearningPlan(
  empty(),
  ["linear-search", "binary-search"],
  "2026-08-23T00:00:00.000Z",
);
assert.deepEqual(
  firstPlan.actions.map((action) => [action.slug, action.kind]),
  [["linear-search", "learn"]],
  "a new learner should receive the first canonical lesson instead of an arbitrary recommendation",
);
assert.equal(firstPlan.completionPercent, 0);
assert.equal(firstPlan.inProgressCount, 0);

const adaptiveProgress: ProgressState = {
  opened: ["linear-search", "binary-search", "stack"],
  visualized: ["linear-search", "binary-search"],
  practicePassed: ["linear-search", "stack"],
  mastered: ["linear-search"],
  review: {
    "linear-search": {
      streak: 1,
      lastPassedAt: "2026-08-20T00:00:00.000Z",
      dueAt: "2026-08-21T00:00:00.000Z",
    },
  },
  lastLesson: "binary-search",
};
const adaptivePlan = buildLearningPlan(
  adaptiveProgress,
  ["linear-search", "binary-search", "stack", "queue"],
  "2026-08-23T00:00:00.000Z",
);
assert.deepEqual(
  adaptivePlan.actions.map((action) => [action.slug, action.kind]),
  [
    ["linear-search", "review"],
    ["binary-search", "finish-practice"],
    ["stack", "finish-trace"],
    ["queue", "learn"],
  ],
  "study queue must prioritize due review, unfinished evidence and only then new material",
);
assert.equal(adaptivePlan.dueReviewCount, 1);
assert.equal(adaptivePlan.inProgressCount, 2);
assert.equal(adaptivePlan.completionPercent, 25);

const boundedPlan = buildLearningPlan(
  adaptiveProgress,
  ["linear-search", "binary-search", "stack", "queue"],
  "2026-08-23T00:00:00.000Z",
  2,
);
assert.deepEqual(
  boundedPlan.actions.map((action) => action.slug),
  ["linear-search", "binary-search"],
  "session size must be bounded without changing priority order",
);

const completeProgress: ProgressState = {
  opened: ["linear-search"],
  visualized: ["linear-search"],
  practicePassed: ["linear-search"],
  mastered: ["linear-search"],
  review: {
    "linear-search": {
      streak: 1,
      lastPassedAt: "2026-08-23T00:00:00.000Z",
      dueAt: "2026-08-24T00:00:00.000Z",
    },
  },
  lastLesson: "linear-search",
};
const completePlan = buildLearningPlan(
  completeProgress,
  ["linear-search"],
  "2026-08-23T12:00:00.000Z",
);
assert.equal(completePlan.isComplete, true);
assert.deepEqual(completePlan.actions, []);
assert.equal(completePlan.nextReviewAt, "2026-08-24T00:00:00.000Z");

console.log("learning progress verification passed");
